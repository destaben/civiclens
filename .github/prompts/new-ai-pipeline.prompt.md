---
description: Adding a new AI/LLM pipeline task
---

Create a new AI pipeline task following CivicLens conventions:

1. Add the pipeline logic in `backend/app/ai/`
2. Use LangChain for orchestration when chaining multiple calls
3. Follow cost-efficiency guidelines:
   - Cache results in Redis with appropriate TTL
   - Use the cheapest model that achieves acceptable quality
   - Set explicit `max_tokens` limits
   - Implement retry with exponential backoff

4. Create a Pydantic model for structured output parsing
5. Write tests with mocked LLM responses (never call real APIs in tests)

Template:
```python
from pydantic import BaseModel, Field

from app.ai.client import get_llm_client
from app.core.cache import cache_result


class SummaryOutput(BaseModel):
    """Structured output from the summarization pipeline."""

    summary: str = Field(..., description="Concise summary of the contract")
    key_points: list[str] = Field(default_factory=list, description="Key takeaways")
    risk_score: str = Field(..., description="Overall risk assessment")


@cache_result(ttl=3600)
async def summarize_contract(content: str) -> SummaryOutput:
    """Summarize a contract document using an LLM.

    Args:
        content: The full text of the contract.

    Returns:
        Structured summary with key points and risk score.
    """
    client = get_llm_client(model="gpt-4o-mini")
    response = await client.generate_structured(
        prompt=f"Summarize this government contract for a general audience:\n\n{content}",
        output_schema=SummaryOutput,
        max_tokens=1024,
    )
    return response
```
