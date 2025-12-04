from pydantic import BaseModel, EmailStr
from typing import Optional
from app.models.user import PlanType


class UserCreate(BaseModel):
    """Schema for user registration."""
    email: EmailStr
    password: str
    name: str


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Schema for user response."""
    id: int
    email: str
    name: str
    plan: PlanType
    api_key: Optional[str] = None
    created_at: str
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    """Schema for JWT token response."""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Schema for token payload data."""
    email: Optional[str] = None


class UserUpdate(BaseModel):
    """Schema for updating user information."""
    name: Optional[str] = None
    email: Optional[EmailStr] = None


class PasswordReset(BaseModel):
    """Schema for password reset request."""
    email: EmailStr


class UsageResponse(BaseModel):
    """Schema for API usage statistics."""
    api_calls: int
    quota: int
    remaining: int
    reset_date: Optional[str] = None
