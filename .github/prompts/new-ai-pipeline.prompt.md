---
description: Adding a new Anomaly Engine task (pattern scoring / risk analysis)
---

Create a new **Anomaly Engine** task in the AI pipeline following CivicLens conventions.

> **Scope:** This prompt is for tasks in `backend/app/ai/anomaly/` — pattern scoring, risk analysis, and statistical irregularity detection on procurement data. For tasks that involve the **Legal Context Agent** (RAG over LCSP 9/2017 / EU Directives), use the `new-legal-agent-task` prompt instead.

1. Add the pipeline logic in `backend/app/ai/anomaly/`
2. For single-call tasks (no chaining), use `get_llm_client` directly as shown in the template. Reserve LangChain for pipelines that require two or more sequential or conditional LLM calls.
3. Follow cost-efficiency guidelines:
   - Cache results in Redis with a TTL matched to data freshness requirements: use 3600s (1 hour) for document-derived outputs unlikely to change, 300s (5 minutes) for outputs derived from live or frequently updated data, and 86400s (24 hours) for static reference data.
   - Default to `gpt-4o-mini`; escalate to `gpt-4o` only if structured output compliance fails on `gpt-4o-mini` for the specific task.
   - Set explicit `max_tokens` limits.
   - Implement retry using `tenacity`: max 3 attempts, initial wait 1 second, exponential backoff factor 2, retry only on `RateLimitError` and `APITimeoutError` from the LLM client. Do not retry on `ValidationError` or `AuthenticationError`.

4. Create a Pydantic model for structured output parsing. Wrap `client.generate_structured(...)` in a try/except for `pydantic.ValidationError`. On validation failure, log the raw response at WARNING level and raise a domain-specific exception (e.g., `AIOutputParsingError`) rather than propagating the raw Pydantic error to callers.
5. Never interpolate untrusted input directly into the instruction portion of a prompt string. Use a structured two-message format that separates the system instruction from the user-supplied data.
6. Place tests in `backend/tests/ai/anomaly/test_<task_name>.py`. Use `pytest` with `unittest.mock.patch` or a project-standard fixture to mock `get_llm_client`. Each test must assert both the returned output field values and that the real LLM client was never called (`assert_not_called` or equivalent). Never call real APIs in tests.

Template:
```python
from typing import Literal

from pydantic import BaseModel, Field
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

from app.ai.client import get_llm_client
from app.core.cache import cache_result
from app.core.exceptions import AIOutputParsingError


class AnomalyAnalysisOutput(BaseModel):
    """Structured output from an anomaly detection / scoring task."""

    anomalies_detected: list[str] = Field(
        default_factory=list,
        description="List of detected anomaly types (e.g. 'split_contract', 'sole_source')",
    )
    risk_score: Literal["low", "medium", "high", "critical"] = Field(
        ..., description="Overall risk assessment: one of low, medium, high, critical"
    )
    rationale: str = Field(..., description="Brief explanation of the risk score")


@cache_result(ttl=3600)
@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=1, max=8),
    retry=retry_if_exception_type((RateLimitError, APITimeoutError)),
)
async def analyze_contract_anomalies(content: str) -> AnomalyAnalysisOutput:
    """Score a contract for procurement anomalies and irregularities.

    Args:
        content: The full text of the contract.

    Returns:
        Structured anomaly analysis with risk score and rationale.
    """
    client = get_llm_client(model="gpt-4o-mini")
    try:
        response = await client.generate_structured(
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a procurement auditor. Analyse the following government "
                        "contract for statistical irregularities and suspicious patterns "
                        "(e.g. split contracts, anomalous pricing, short tender windows, "
                        "sole-source awards). Output only valid JSON matching the required schema."
                    ),
                },
                {"role": "user", "content": content},
            ],
            output_schema=AnomalyAnalysisOutput,
            max_tokens=1024,
        )
    except ValidationError as exc:
        logger.warning("LLM output failed schema validation: %s", exc)
        raise AIOutputParsingError("analyze_contract_anomalies output did not match schema") from exc
    return response
```
