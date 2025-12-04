from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from pydantic import BaseModel
from datetime import datetime
import secrets

from app.core.database import get_session
from app.core.security import get_current_user
from app.models.user import User
from app.models.webhook import Webhook

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])


class WebhookCreate(BaseModel):
    """Schema for creating a webhook."""
    url: str
    events: List[str]


@router.post("")
async def register_webhook(
    webhook_data: WebhookCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Register a new webhook."""
    valid_events = ["scrape.completed", "scrape.failed", "export.ready", "usage.limit"]
    invalid_events = [e for e in webhook_data.events if e not in valid_events]
    if invalid_events:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid events: {', '.join(invalid_events)}. Valid events: {', '.join(valid_events)}"
        )
    
    webhook_id = f"wh_{secrets.token_urlsafe(16)}"
    webhook_secret = secrets.token_urlsafe(32)
    
    webhook = Webhook(
        webhook_id=webhook_id,
        user_id=current_user.id,
        url=webhook_data.url,
        events=webhook_data.events,
        secret=webhook_secret
    )
    session.add(webhook)
    session.commit()
    session.refresh(webhook)
    
    return {
        "webhook_id": webhook_id,
        "url": webhook_data.url,
        "events": webhook_data.events,
        "secret": webhook_secret,
        "message": "Webhook registered successfully"
    }


@router.get("")
async def list_webhooks(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """List registered webhooks."""
    statement = select(Webhook).where(Webhook.user_id == current_user.id)
    webhooks = session.exec(statement).all()
    
    return {
        "webhooks": [
            {
                "webhook_id": w.webhook_id,
                "url": w.url,
                "events": w.events,
                "is_active": w.is_active,
                "created_at": w.created_at.isoformat()
            } for w in webhooks
        ]
    }


@router.delete("/{webhook_id}")
async def delete_webhook(
    webhook_id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Delete a webhook."""
    statement = select(Webhook).where(
        Webhook.webhook_id == webhook_id,
        Webhook.user_id == current_user.id
    )
    webhook = session.exec(statement).first()
    
    if not webhook:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Webhook not found"
        )
    
    session.delete(webhook)
    session.commit()
    
    return {"message": "Webhook deleted successfully"}
