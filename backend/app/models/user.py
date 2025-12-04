from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
from enum import Enum


class PlanType(str, Enum):
    FREE = "free"
    STARTER = "starter"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"


class User(SQLModel, table=True):
    """User model for authentication and account management."""
    
    __tablename__ = "users"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    name: str
    hashed_password: str
    plan: PlanType = Field(default=PlanType.FREE)
    api_key: Optional[str] = Field(default=None, unique=True, index=True)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Usage tracking
    api_calls_used: int = Field(default=0)
    api_calls_reset_at: Optional[datetime] = None
