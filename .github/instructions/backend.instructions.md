---
applyTo: "backend/**/*.py"
---

# Python Backend Instructions

## Style & Formatting
- Follow PEP 8; enforce with `ruff check` and `ruff format`
- Maximum line length: 88 characters (Black/Ruff default)
- Use type hints on all function signatures and return types
- Use Google-style docstrings on all public functions and classes

## Patterns
- Use dependency injection via FastAPI `Depends()`
- Keep route handlers thin — delegate to service layer
- Use Pydantic v2 `BaseModel` for all request/response schemas
- Use `async def` for all I/O-bound operations
- Use custom exception classes inheriting from a base `AppError`

## Imports
Order: stdlib → third-party → local, separated by blank lines.
Use absolute imports (`from app.services.regulation import ...`).

## Error Handling
- Raise `HTTPException` with appropriate status codes in route handlers
- Use custom domain exceptions in the service layer
- Never use bare `except:` — always catch specific exceptions

## Testing
- Use pytest with `pytest-asyncio`
- Mock external services; never make real API calls in tests
- Use fixtures for reusable test setup
