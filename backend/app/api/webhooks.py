from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from pydantic import BaseModel, HttpUrl, field_validator
import secrets

from app.core.database import get_session
from app.core.security import get_current_user
from app.models.user import User
from app.models.webhook import Webhook

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])


class WebhookCreate(BaseModel):
    """Schema for creating a webhook."""
    url: HttpUrl
    events: List[str]
    
    @field_validator('url')
    @classmethod
    def validate_url(cls, v: HttpUrl) -> str:
        import ipaddress
        from urllib.parse import urlparse
        
        url_str = str(v)
        parsed = urlparse(url_str)
        hostname = parsed.hostname or ''
        
        # Block common internal hostnames
        blocked_hostnames = ['localhost', 'host.docker.internal']
        if hostname.lower() in blocked_hostnames:
            raise ValueError('Webhook URL cannot point to internal addresses')
        
        # Check if hostname is an IP address and validate it's not private
        try:
            ip = ipaddress.ip_address(hostname)
            if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved:
                raise ValueError('Webhook URL cannot point to private or reserved IP addresses')
        except ValueError as e:
            # Re-raise if it's our error message about private IPs
            if 'private' in str(e).lower() or 'reserved' in str(e).lower():
                raise
            # Otherwise it's not an IP address, just a hostname - allow it
            pass
        
        return url_str


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
