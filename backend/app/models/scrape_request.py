from datetime import datetime, timezone
from typing import Optional, List
from sqlmodel import SQLModel, Field, Column, JSON
from enum import Enum


class ScrapeStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class ScrapeRequest(SQLModel, table=True):
    """Scrape request model for custom URL scraping."""
    
    __tablename__ = "scrape_requests"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    request_id: str = Field(unique=True, index=True)  # Public facing ID like "req_abc123"
    user_id: int = Field(foreign_key="users.id", index=True)
    url: str
    platform: str
    status: ScrapeStatus = Field(default=ScrapeStatus.PENDING)
    fields: List[str] = Field(default=[], sa_column=Column(JSON))
    webhook_url: Optional[str] = None
    result_data: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    result_count: int = Field(default=0)
    error_message: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None
