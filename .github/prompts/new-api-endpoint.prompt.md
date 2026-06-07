---
description: Creating a new FastAPI endpoint
---

Create a new API endpoint following CivicLens conventions:

1. Create a route handler in `backend/app/api/` with proper:
   - Type-annotated request/response using Pydantic schemas
   - Dependency injection for auth and database sessions
   - Proper HTTP status codes and error responses
   - Google-style docstring

2. Create corresponding Pydantic schemas in `backend/app/schemas/`

3. Add business logic in `backend/app/services/` (keep routes thin)

4. Write tests in `backend/tests/` using pytest fixtures

Example structure:
```python
@router.post(
    "/contracts/{contract_id}/comments",
    response_model=CommentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_comment(
    contract_id: str,
    payload: CommentCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
) -> CommentResponse:
    """Create a new public comment on a contract."""
    return await comment_service.create(db, contract_id, payload, user)
```
