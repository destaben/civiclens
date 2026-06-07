---
applyTo: "backend/**/*.py"
---

# Python Backend Instructions

## Style & Formatting
- Follow PEP 8; enforce with `ruff check` and `ruff format`
- Maximum line length: 88 characters (Black/Ruff default)
- Add type hints to all function and method definitions, including private helpers (prefixed `_`). Lambdas and nested functions inside other functions are exempt.
- Use Google-style docstrings on all public functions and classes

## Patterns
- Use dependency injection via FastAPI `Depends()`
- Route handlers must contain only: (1) calling one service method, (2) returning the response schema. Input validation belongs in Pydantic schemas; auth belongs in FastAPI dependencies; logging belongs in middleware.
- Use Pydantic v2 `BaseModel` for all request/response schemas
- Use `async def` for all I/O-bound operations
- Use custom exception classes inheriting from a base `AppError`
- Manage database sessions via a `get_db` dependency injected with `Depends()`. Wrap multi-step writes in an explicit transaction using `async with session.begin()`. Never commit inside individual repository methods; commit at the service layer boundary.
- Use Python stdlib `logging` with a module-level logger (`logger = logging.getLogger(__name__)`). Log unexpected exceptions at ERROR level in the service layer before re-raising. Do not log inside route handlers.

## Imports
Order: stdlib → third-party → local, separated by blank lines.
Use absolute imports (`from app.services.contract import ...`).

## Error Handling
- Define custom domain exceptions in the service layer as subclasses of a base `AppError` (which carries a `status_code` attribute).
- Register a global FastAPI exception handler that catches `AppError` subclasses and maps them to `HTTPException`. Route handlers must not catch `AppError` directly. Example: `@app.exception_handler(AppError)` returning the appropriate status code from `error.status_code`.
- Never use bare `except:` — always catch specific exceptions

## Testing
- Use pytest with `pytest-asyncio`
- Mock external services; never make real API calls in tests
- Use fixtures for reusable test setup
