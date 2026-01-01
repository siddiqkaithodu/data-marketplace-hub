from datetime import timedelta
from logging import getLogger
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from app.core.database import get_session
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user,
    generate_api_key
)
from app.core.config import settings
from app.models.user import User
from app.schemas.user import (
    UserCreate,
    UserResponse,
    Token,
    PasswordReset
)

logger = getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate, session: Session = Depends(get_session)):
    """Register a new user account."""
    # Check if user already exists
    statement = select(User).where(User.email == user_data.email)
    existing_user = session.exec(statement).first()
    if existing_user:
        logger.warning(f"Attempt to register with existing email: {user_data.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user = User(
        email=user_data.email,
        name=user_data.name,
        hashed_password=get_password_hash(user_data.password),
        api_key=generate_api_key()
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    logger.info(f"New user registered: {user.email}")
    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        plan=user.plan,
        api_key=user.api_key,
        created_at=user.created_at.isoformat()
    )


@router.post("/signin", response_model=Token)
async def signin(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):
    """Authenticate user and return JWT token."""
    statement = select(User).where(User.email == form_data.username)
    user = session.exec(statement).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@router.post("/signout")
async def signout(current_user: User = Depends(get_current_user)):
    """Sign out the current user (client should discard token)."""
    return {"message": "Successfully signed out"}


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current authenticated user details."""
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        plan=current_user.plan,
        api_key=current_user.api_key,
        created_at=current_user.created_at.isoformat()
    )


@router.post("/refresh", response_model=Token)
async def refresh_token(current_user: User = Depends(get_current_user)):
    """Refresh authentication token."""
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": current_user.email}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@router.post("/reset-password")
async def reset_password(
    reset_data: PasswordReset,
    session: Session = Depends(get_session)
):
    """Request password reset (placeholder - would send email in production)."""
    # Query to verify email exists (but don't reveal this to prevent enumeration)
    statement = select(User).where(User.email == reset_data.email)
    session.exec(statement).first()
    
    # Always return success to prevent email enumeration
    return {"message": "If an account exists with this email, a reset link has been sent"}
