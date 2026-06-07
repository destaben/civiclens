---
description: Writing tests for the project
---

Write tests following CivicLens conventions:

## Python (Backend)
- Use `pytest` with async support (`pytest-asyncio`)
- Place tests in `backend/tests/` mirroring the source structure
- Use fixtures for database sessions, test clients, and mock data
- Never call external APIs in tests — use mocks/fakes
- Name test files `test_<module>.py`, functions `test_<behavior>()`

```python
import pytest
from httpx import AsyncClient

from app.main import app


@pytest.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac


@pytest.mark.asyncio
async def test_list_regulations_returns_paginated_results(client: AsyncClient):
    """Listing regulations should return paginated results."""
    response = await client.get("/api/v1/regulations?page=1&size=10")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
```

## TypeScript (Frontend)
- Use Vitest for unit tests, Playwright for E2E
- Place tests alongside components: `component.test.tsx`
- Test user-visible behavior, not implementation details
- Use Testing Library queries (`getByRole`, `getByText`)

```typescript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { RegulationCard } from "./regulation-card";

describe("RegulationCard", () => {
  it("renders the title and summary", () => {
    render(<RegulationCard id="1" title="Clean Air Act" summary="A summary" />);
    expect(screen.getByText("Clean Air Act")).toBeInTheDocument();
    expect(screen.getByText("A summary")).toBeInTheDocument();
  });
});
```
