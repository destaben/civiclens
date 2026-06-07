# Copilot Instructions — CivicLens

## Project Overview

CivicLens is a civic technology platform that uses AI to make government regulatory processes more transparent and accessible. The system ingests federal regulations and public comments, summarizes them with LLMs, and presents them through an intuitive web interface.

## Architecture

```
┌────────────┐     ┌───────────────┐     ┌────────────┐
│  Frontend  │────▶│  Backend API  │────▶│  Database  │
│  (Next.js) │     │  (FastAPI)    │     │ (PostgreSQL)│
└────────────┘     └───────────────┘     └────────────┘
                          │
                   ┌──────┴──────┐
                   │  AI/LLM     │
                   │  Pipeline   │
                   └─────────────┘
```

- **Frontend**: Next.js 14+ with TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Python 3.12+, FastAPI, SQLAlchemy 2.x, Pydantic v2
- **Database**: PostgreSQL 16, Redis for caching/queues
- **AI Pipeline**: OpenAI API, LangChain for orchestration
- **Infrastructure**: Docker, GitHub Actions CI/CD, GitHub Pages (frontend hosting)

## Coding Conventions

### Python (Backend & AI Pipeline)

- **Style**: Follow PEP 8; use `ruff` for linting and formatting
- **Type hints**: Required on all function signatures
- **Docstrings**: Google-style docstrings on all public functions/classes
- **Imports**: Use absolute imports; group stdlib → third-party → local
- **Async**: Prefer `async def` for I/O-bound operations
- **Error handling**: Use custom exception classes; never bare `except:`
- **Testing**: pytest with fixtures; aim for ≥80% coverage on business logic
- **Naming**: `snake_case` for functions/variables, `PascalCase` for classes

```python
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.core.deps import get_current_user
from app.models.user import User


class RegulationResponse(BaseModel):
    """Response schema for a single regulation."""

    id: str = Field(..., description="Unique regulation identifier")
    title: str = Field(..., description="Regulation title")
    summary: Optional[str] = Field(None, description="AI-generated summary")
```

### TypeScript (Frontend)

- **Style**: ESLint + Prettier; strict TypeScript (`strict: true`)
- **Components**: Functional components with named exports
- **State**: React Server Components by default; client components only when needed
- **Naming**: `camelCase` for variables/functions, `PascalCase` for components/types
- **Files**: `kebab-case` for filenames (e.g., `regulation-card.tsx`)
- **Imports**: Use path aliases (`@/components`, `@/lib`)
- **Error handling**: Use Error Boundaries; handle loading/error states explicitly

```typescript
interface RegulationCardProps {
  id: string;
  title: string;
  summary: string | null;
}

export function RegulationCard({ id, title, summary }: RegulationCardProps) {
  return (
    <article className="rounded-lg border p-4 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      {summary && <p className="mt-2 text-muted-foreground">{summary}</p>}
    </article>
  );
}
```

### Documentation

- Write clear, concise commit messages: `type(scope): description`
- Keep README sections up to date when adding features
- Add JSDoc/docstrings to all exported functions and public APIs

## File Organization

```
civiclens/
├── backend/           # Python FastAPI application
│   ├── app/
│   │   ├── api/       # Route handlers
│   │   ├── core/      # Config, deps, security
│   │   ├── models/    # SQLAlchemy models
│   │   ├── schemas/   # Pydantic schemas
│   │   ├── services/  # Business logic
│   │   └── ai/        # LLM pipeline code
│   ├── tests/
│   ├── pyproject.toml
│   └── Dockerfile
├── frontend/          # Next.js application
│   ├── src/
│   │   ├── app/       # App router pages
│   │   ├── components/
│   │   ├── lib/       # Utilities & API client
│   │   └── types/
│   ├── package.json
│   └── Dockerfile
├── infra/             # Infrastructure as code
├── docs/              # Extended documentation
├── .github/           # CI/CD & Copilot config
└── docker-compose.yml
```

## AI & Cost Efficiency Guidelines

- **Batch API calls** whenever possible to reduce round-trips
- **Cache LLM responses** in Redis with configurable TTL
- **Use streaming** for long-form generation to improve UX
- **Token budgets**: Set `max_tokens` appropriately per use case
- **Model selection**: Use cheaper models (gpt-4o-mini) for classification/routing; reserve gpt-4o for complex summarization
- **Embeddings**: Cache embeddings; recompute only on content change
- **Rate limiting**: Implement exponential backoff and circuit breakers

## Security

- Never log or expose API keys, tokens, or secrets
- Validate all inputs with Pydantic (backend) or Zod (frontend)
- Use parameterized queries (SQLAlchemy handles this)
- Sanitize user-generated content before rendering
- Apply CORS restrictions in production
- Use HTTPS everywhere in deployed environments

## Git Workflow

- Branch naming: `feature/description`, `fix/description`, `chore/description`
- Commit format: `type(scope): short description` (e.g., `feat(api): add regulation search endpoint`)
- PR descriptions should reference the issue number
- Keep PRs small and focused on a single concern
