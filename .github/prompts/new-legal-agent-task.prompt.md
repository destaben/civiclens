---
description: Adding a new Legal Context Agent task (RAG over LCSP 9/2017 / EU Directives)
---

Create a new **Legal Context Agent** task following CivicLens conventions.

> **Scope:** This prompt is for tasks in `backend/app/ai/legal/` — RAG-based retrieval and legal contextualisation of detected anomalies using LCSP 9/2017 and EU Directives 2014/23–25/EU. For pure pattern-scoring and anomaly detection tasks, use the `new-ai-pipeline` prompt instead.

> **Informational only.** Every output from this agent must include the platform disclaimer. The agent provides legal context, not legal advice.

1. Add the task logic in `backend/app/ai/legal/`
2. Follow the RAG pattern:
   - **Embed** the query (anomaly description) using the project embedding client (`get_embedding_client`)
   - **Retrieve** the top-k relevant legal document chunks from the vector store (default `k=5`); cache embeddings with `ttl=86400` (24 hours — static legal texts)
   - **Ground** the LLM response strictly in the retrieved chunks; instruct the model not to cite articles it did not retrieve
   - Never interpolate untrusted input directly into the system instruction. Pass anomaly descriptions as the `user` message.
3. Follow cost-efficiency guidelines:
   - Default to `gpt-4o-mini`; escalate to `gpt-4o` only if structured output compliance fails.
   - Cache LLM responses in Redis with `ttl=3600` (1 hour); legal context for the same anomaly type is unlikely to change within a session.
   - Set explicit `max_tokens` limits (default 2048 for legal explanations).
   - Implement retry using `tenacity`: max 3 attempts, initial wait 1 second, exponential backoff factor 2, retry only on `RateLimitError` and `APITimeoutError`. Do not retry on `ValidationError` or `AuthenticationError`.
4. Create a Pydantic model for structured output. Wrap `client.generate_structured(...)` in a try/except for `pydantic.ValidationError`. On failure, log the raw response at WARNING level and raise `AIOutputParsingError`.
5. Always include `disclaimer` in the output schema, populated with the fixed disclaimer string (do not let the LLM generate it).
6. Place tests in `backend/tests/ai/legal/test_<task_name>.py`. Mock both `get_embedding_client` and `get_llm_client`. Assert that the disclaimer is always present in the output and that no real API calls were made.

Template:
```python
import logging
from typing import Literal

from pydantic import BaseModel, Field
from tenacity import retry, retry_if_exception_type, stop_after_attempt, wait_exponential

from app.ai.client import get_llm_client
from app.ai.embeddings import get_embedding_client
from app.ai.vector_store import retrieve_legal_chunks
from app.core.cache import cache_result
from app.core.exceptions import AIOutputParsingError

logger = logging.getLogger(__name__)

DISCLAIMER = (
    "Esta información es orientativa y no constituye asesoramiento jurídico. "
    "Consulte a un profesional cualificado antes de actuar sobre cualquier hallazgo."
)


class LegalContextOutput(BaseModel):
    """Structured output from the Legal Context Agent."""

    relevant_articles: list[str] = Field(
        default_factory=list,
        description="List of cited article references (e.g. 'LCSP Art. 131', 'Dir. 2014/24/EU Art. 18')",
    )
    legal_context: str = Field(
        ...,
        description="Plain-language explanation of the legal framework applicable to the anomaly",
    )
    severity_under_law: Literal["informational", "potential_infringement", "likely_infringement"] = Field(
        ...,
        description="Legal severity classification based solely on retrieved articles",
    )
    disclaimer: str = Field(
        default=DISCLAIMER,
        description="Fixed informational disclaimer — do not modify",
    )


@cache_result(ttl=3600)
@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=1, max=8),
    retry=retry_if_exception_type((RateLimitError, APITimeoutError)),
)
async def get_legal_context(anomaly_description: str) -> LegalContextOutput:
    """Retrieve relevant legal articles and contextualise a detected procurement anomaly.

    Args:
        anomaly_description: Plain-language description of the detected anomaly.

    Returns:
        Legal context grounded in LCSP 9/2017 and EU Directives, with disclaimer.
    """
    embedding_client = get_embedding_client()
    chunks = await retrieve_legal_chunks(
        embedding_client=embedding_client,
        query=anomaly_description,
        k=5,
    )
    context_text = "\n\n".join(chunk.text for chunk in chunks)

    client = get_llm_client(model="gpt-4o-mini")
    try:
        response = await client.generate_structured(
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a legal assistant specialised in Spanish and EU public procurement law. "
                        "Using ONLY the legal excerpts provided below, explain which articles are relevant "
                        "to the described procurement anomaly and classify its severity. "
                        "Do not cite any article not present in the excerpts. "
                        "Output only valid JSON matching the required schema.\n\n"
                        f"LEGAL EXCERPTS:\n{context_text}"
                    ),
                },
                {"role": "user", "content": anomaly_description},
            ],
            output_schema=LegalContextOutput,
            max_tokens=2048,
        )
    except ValidationError as exc:
        logger.warning("Legal agent output failed schema validation: %s", exc)
        raise AIOutputParsingError("get_legal_context output did not match schema") from exc

    # Ensure disclaimer is always the canonical value, never LLM-generated
    response.disclaimer = DISCLAIMER
    return response
```
