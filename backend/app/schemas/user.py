from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from app.models.user import PlanType


class UserCreate(BaseModel):
    """Schema for user registration."""
    email: EmailStr
    password: str
    name: str
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        
        has_upper = has_lower = has_digit = False
        for char in v:
            if char.isupper():
                has_upper = True
            elif char.islower():
                has_lower = True
            elif char.isdigit():
                has_digit = True
            # Early exit if all conditions met
            if has_upper and has_lower and has_digit:
                break
        
        if not has_upper:
            raise ValueError('Password must contain at least one uppercase letter')
        if not has_lower:
            raise ValueError('Password must contain at least one lowercase letter')
        if not has_digit:
            raise ValueError('Password must contain at least one number')
        return v
    
    @field_validator('name')
    @classmethod
    def validate_name(cls, v: str) -> str:
        if len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters long')
        return v.strip()


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
