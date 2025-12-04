from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from app.models.scrape_request import ScrapeStatus


class ScrapeRequestCreate(BaseModel):
    """Schema for creating a scrape request."""
    url: str
    platform: str
    fields: Optional[List[str]] = None
    webhook: Optional[str] = None


class ScrapeRequestResponse(BaseModel):
    """Schema for scrape request response."""
    request_id: str
    url: str
    platform: str
    status: ScrapeStatus
    result_count: int
    created_at: str
    completed_at: Optional[str] = None
    
    class Config:
        from_attributes = True


class ScrapeStatusResponse(BaseModel):
    """Schema for scrape status check response."""
    request_id: str
    status: ScrapeStatus
    data: Optional[dict] = None
    record_count: int = 0
    error_message: Optional[str] = None
    estimated_time: Optional[str] = None


class ScrapeHistoryResponse(BaseModel):
    """Schema for scrape history response."""
    requests: List[ScrapeRequestResponse]
    total: int
