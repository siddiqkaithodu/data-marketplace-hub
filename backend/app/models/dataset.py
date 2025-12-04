from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Column, JSON
from enum import Enum


class Platform(str, Enum):
    AMAZON = "amazon"
    SHOPIFY = "shopify"
    EBAY = "ebay"
    WALMART = "walmart"
    ETSY = "etsy"


class Dataset(SQLModel, table=True):
    """Dataset model for marketplace data."""
    
    __tablename__ = "datasets"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    platform: Platform
    category: str = Field(index=True)
    description: str
    record_count: int = Field(default=0)
    size: str
    is_premium: bool = Field(default=False)
    tags: List[str] = Field(default=[], sa_column=Column(JSON))
    preview_data: List[dict] = Field(default=[], sa_column=Column(JSON))
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
