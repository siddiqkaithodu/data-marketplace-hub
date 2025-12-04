from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from datetime import datetime

from app.core.database import get_session
from app.core.security import get_current_user, generate_api_key
from app.models.user import User, PlanType
from app.models.pricing_plan import PricingPlan
from app.schemas.user import UserUpdate, UsageResponse

router = APIRouter(prefix="/account", tags=["Account"])


@router.get("")
async def get_account(current_user: User = Depends(get_current_user)):
    """Get account details."""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "plan": current_user.plan,
        "api_key": current_user.api_key,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at.isoformat(),
        "updated_at": current_user.updated_at.isoformat()
    }


@router.put("")
async def update_account(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Update account information."""
    if update_data.name:
        current_user.name = update_data.name
    if update_data.email:
        # Check if email is already taken
        statement = select(User).where(User.email == update_data.email, User.id != current_user.id)
        existing = session.exec(statement).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use"
            )
        current_user.email = update_data.email
    
    current_user.updated_at = datetime.utcnow()
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "plan": current_user.plan,
        "updated_at": current_user.updated_at.isoformat()
    }


@router.get("/usage", response_model=UsageResponse)
async def get_usage(
    period: str = "current",
    current_user: User = Depends(get_current_user)
):
    """Get API usage statistics and remaining quota."""
    # Get plan limits
    plan_limits = {
        PlanType.FREE: 1000,
        PlanType.STARTER: 50000,
        PlanType.PROFESSIONAL: 500000,
        PlanType.ENTERPRISE: -1  # Unlimited
    }
    
    quota = plan_limits.get(current_user.plan, 1000)
    remaining = quota - current_user.api_calls_used if quota > 0 else -1
    
    return UsageResponse(
        api_calls=current_user.api_calls_used,
        quota=quota,
        remaining=remaining,
        reset_date=current_user.api_calls_reset_at.isoformat() if current_user.api_calls_reset_at else None
    )


@router.get("/api-key")
async def get_api_key(current_user: User = Depends(get_current_user)):
    """Get current API key."""
    return {"api_key": current_user.api_key}


@router.post("/api-key/regenerate")
async def regenerate_api_key(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Generate a new API key."""
    new_api_key = generate_api_key()
    current_user.api_key = new_api_key
    current_user.updated_at = datetime.utcnow()
    session.add(current_user)
    session.commit()
    
    return {"api_key": new_api_key, "message": "API key regenerated successfully"}


# Billing routes
billing_router = APIRouter(prefix="/billing", tags=["Billing"])


@billing_router.get("/plans")
async def list_plans(session: Session = Depends(get_session)):
    """List available subscription plans."""
    statement = select(PricingPlan).where(PricingPlan.is_active == True)
    plans = session.exec(statement).all()
    
    # If no plans in DB, return default plans
    if not plans:
        return {
            "plans": [
                {
                    "id": "free",
                    "name": "Free",
                    "price": 0,
                    "period": "month",
                    "features": ["1,000 API calls/month", "Access to public datasets", "Basic data previews"],
                    "api_calls": 1000
                },
                {
                    "id": "starter",
                    "name": "Starter",
                    "price": 49,
                    "period": "month",
                    "features": ["50,000 API calls/month", "Access to all datasets", "Custom URL scraping (10/day)"],
                    "api_calls": 50000
                },
                {
                    "id": "professional",
                    "name": "Professional",
                    "price": 199,
                    "period": "month",
                    "features": ["500,000 API calls/month", "Priority API access", "Custom URL scraping (100/day)"],
                    "api_calls": 500000,
                    "highlighted": True
                },
                {
                    "id": "enterprise",
                    "name": "Enterprise",
                    "price": 999,
                    "period": "month",
                    "features": ["Unlimited API calls", "Dedicated infrastructure", "Custom scraping (unlimited)"],
                    "api_calls": -1
                }
            ]
        }
    
    return {
        "plans": [
            {
                "id": p.plan_id,
                "name": p.name,
                "price": p.price,
                "period": p.period,
                "features": p.features,
                "api_calls": p.api_calls,
                "highlighted": p.is_highlighted
            } for p in plans
        ]
    }


@billing_router.post("/subscribe")
async def subscribe(
    plan_id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Subscribe to a plan."""
    valid_plans = ["free", "starter", "professional", "enterprise"]
    if plan_id not in valid_plans:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid plan"
        )
    
    # In production, this would integrate with payment processor
    current_user.plan = PlanType(plan_id)
    current_user.updated_at = datetime.utcnow()
    session.add(current_user)
    session.commit()
    
    return {"message": f"Successfully subscribed to {plan_id} plan", "plan": plan_id}


@billing_router.put("/subscription")
async def update_subscription(
    plan_id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Update subscription plan."""
    valid_plans = ["free", "starter", "professional", "enterprise"]
    if plan_id not in valid_plans:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid plan"
        )
    
    old_plan = current_user.plan
    current_user.plan = PlanType(plan_id)
    current_user.updated_at = datetime.utcnow()
    session.add(current_user)
    session.commit()
    
    return {"message": f"Subscription updated from {old_plan} to {plan_id}", "plan": plan_id}


@billing_router.delete("/subscription")
async def cancel_subscription(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Cancel subscription (downgrade to free)."""
    old_plan = current_user.plan
    current_user.plan = PlanType.FREE
    current_user.updated_at = datetime.utcnow()
    session.add(current_user)
    session.commit()
    
    return {"message": f"Subscription cancelled. Downgraded from {old_plan} to free"}


@billing_router.get("/invoices")
async def get_invoices(current_user: User = Depends(get_current_user)):
    """Get billing history (placeholder)."""
    # In production, this would return actual invoice records
    return {
        "invoices": [],
        "message": "No invoices found"
    }
