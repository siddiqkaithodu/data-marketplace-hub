from datetime import datetime, timezone
from typing import Optional, List
from sqlmodel import SQLModel, Field, Column, JSON


class Webhook(SQLModel, table=True):
    """Webhook registration model."""
    
    __tablename__ = "webhooks"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    webhook_id: str = Field(unique=True, index=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    url: str
    events: List[str] = Field(default=[], sa_column=Column(JSON))
    is_active: bool = Field(default=True)
    secret: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
