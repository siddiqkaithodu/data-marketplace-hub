from pydantic import BaseModel
from typing import Optional, List, Any
from app.models.dataset import Platform


class DatasetCreate(BaseModel):
    """Schema for creating a dataset."""
    name: str
    platform: Platform
    category: str
    description: str
    record_count: int
    size: str
    is_premium: bool = False
    tags: List[str] = []
    preview_data: List[dict] = []


class DatasetResponse(BaseModel):
    """Schema for dataset response."""
    id: int
    name: str
    platform: Platform
    category: str
    description: str
    record_count: int
    size: str
    is_premium: bool
    tags: List[str]
    preview_data: List[dict]
    last_updated: str
    
    class Config:
        from_attributes = True


class DatasetListResponse(BaseModel):
    """Schema for paginated dataset list response."""
    datasets: List[DatasetResponse]
    total: int
    page: int
    per_page: int


class DatasetFilter(BaseModel):
    """Schema for dataset filtering."""
    platform: Optional[Platform] = None
    category: Optional[str] = None
    is_premium: Optional[bool] = None
    search: Optional[str] = None


class ExportRequest(BaseModel):
    """Schema for dataset export request."""
    format: str  # csv, json, parquet
    filters: Optional[dict] = None


class ExportResponse(BaseModel):
    """Schema for export response."""
    export_id: str
    download_url: str
    expires_at: str
