---
description: Adding a new database model and migration
---

Add a new database model following CivicLens conventions:

1. Create the SQLAlchemy model in `backend/app/models/`
2. Create corresponding Pydantic schemas in `backend/app/schemas/`
3. Generate an Alembic migration
4. Write tests for model relationships and constraints

Template:
```python
from datetime import datetime
from typing import Optional

from sqlalchemy import String, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Contract(Base):
    """A public procurement contract tracked by CivicLens."""

    __tablename__ = "contracts"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    title: Mapped[str] = mapped_column(String(512), nullable=False)
    agency: Mapped[str] = mapped_column(String(256), nullable=False)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(64), default="open")
    published_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default="now()"
    )

    comments: Mapped[list["Comment"]] = relationship(back_populates="contract")
```

Then generate migration:
```bash
cd backend
alembic revision --autogenerate -m "add contracts table"
alembic upgrade head
```
