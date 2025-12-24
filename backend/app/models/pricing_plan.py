from datetime import datetime, timezone
from typing import Optional, List
from sqlmodel import SQLModel, Field, Column, JSON
from enum import Enum


class PeriodType(str, Enum):
    MONTH = "month"
    YEAR = "year"


class PricingPlan(SQLModel, table=True):
    """Pricing plan model for subscription tiers."""
    
    __tablename__ = "pricing_plans"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    plan_id: str = Field(unique=True, index=True)  # e.g., "free", "starter", etc.
    name: str
    price: float
    period: PeriodType = Field(default=PeriodType.MONTH)
    features: List[str] = Field(default=[], sa_column=Column(JSON))
    api_calls: int  # -1 for unlimited
    datasets: str
    support: str
    is_highlighted: bool = Field(default=False)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
