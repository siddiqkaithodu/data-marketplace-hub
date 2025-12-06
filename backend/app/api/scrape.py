from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlmodel import Session, select, func
import secrets
from datetime import datetime, timezone

from app.core.database import get_session, engine
from app.core.security import get_current_user
from app.models.user import User
from app.models.scrape_request import ScrapeRequest, ScrapeStatus
from app.schemas.scrape import (
    ScrapeRequestCreate,
    ScrapeRequestResponse,
    ScrapeStatusResponse,
    ScrapeHistoryResponse
)

router = APIRouter(prefix="/scrape", tags=["Scraping"])


def process_scrape_request(request_id: str):
    """Background task to process scraping (placeholder)."""
    # Create a new session within the background task
    with Session(engine) as session:
        statement = select(ScrapeRequest).where(ScrapeRequest.request_id == request_id)
        scrape_request = session.exec(statement).first()
        
        if scrape_request:
            scrape_request.status = ScrapeStatus.COMPLETED
            scrape_request.completed_at = datetime.now(timezone.utc)
            scrape_request.result_count = 1
            scrape_request.result_data = {
                "scraped": True,
                "url": scrape_request.url,
                "data": {"sample": "Scraped data would appear here"}
            }
            session.add(scrape_request)
            session.commit()


@router.post("", response_model=ScrapeStatusResponse, status_code=status.HTTP_201_CREATED)
async def submit_scrape_request(
    scrape_data: ScrapeRequestCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Submit a new scraping request."""
    # Check user's plan for scraping limits
    if current_user.plan == "free":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Custom scraping is not available on the free plan"
        )
    
    # Validate platform
    valid_platforms = ["amazon", "shopify", "ebay", "walmart", "etsy"]
    if scrape_data.platform.lower() not in valid_platforms:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid platform. Supported: {', '.join(valid_platforms)}"
        )
    
    # Create scrape request
    request_id = f"req_{secrets.token_urlsafe(12)}"
    scrape_request = ScrapeRequest(
        request_id=request_id,
        user_id=current_user.id,
        url=scrape_data.url,
        platform=scrape_data.platform.lower(),
        fields=scrape_data.fields or [],
        webhook_url=scrape_data.webhook,
        status=ScrapeStatus.PROCESSING
    )
    session.add(scrape_request)
    session.commit()
    session.refresh(scrape_request)
    
    # In production, this would trigger actual scraping
    # For now, simulate with a background task (uses its own session)
    background_tasks.add_task(process_scrape_request, request_id)
    
    return ScrapeStatusResponse(
        request_id=request_id,
        status=ScrapeStatus.PROCESSING,
        estimated_time="30s"
    )


@router.get("/{request_id}", response_model=ScrapeStatusResponse)
async def get_scrape_status(
    request_id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get scraping request status and results."""
    statement = select(ScrapeRequest).where(
        ScrapeRequest.request_id == request_id,
        ScrapeRequest.user_id == current_user.id
    )
    scrape_request = session.exec(statement).first()
    
    if not scrape_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scraping request not found"
        )
    
    return ScrapeStatusResponse(
        request_id=scrape_request.request_id,
        status=scrape_request.status,
        data=scrape_request.result_data,
        record_count=scrape_request.result_count,
        error_message=scrape_request.error_message
    )


@router.get("/{request_id}/results")
async def get_scrape_results(
    request_id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get scraping results data."""
    statement = select(ScrapeRequest).where(
        ScrapeRequest.request_id == request_id,
        ScrapeRequest.user_id == current_user.id
    )
    scrape_request = session.exec(statement).first()
    
    if not scrape_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scraping request not found"
        )
    
    if scrape_request.status != ScrapeStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Scraping is still {scrape_request.status.value}"
        )
    
    return {
        "request_id": scrape_request.request_id,
        "data": scrape_request.result_data,
        "record_count": scrape_request.result_count
    }


@router.get("", response_model=ScrapeHistoryResponse)
async def get_scrape_history(
    limit: int = Query(default=20, le=100),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get user's scraping history."""
    statement = select(ScrapeRequest).where(
        ScrapeRequest.user_id == current_user.id
    ).order_by(ScrapeRequest.created_at.desc()).offset(offset).limit(limit)
    
    requests = session.exec(statement).all()
    
    # Get total count efficiently using COUNT
    total_statement = select(func.count()).select_from(ScrapeRequest).where(ScrapeRequest.user_id == current_user.id)
    total = session.exec(total_statement).one()
    
    return ScrapeHistoryResponse(
        requests=[
            ScrapeRequestResponse(
                request_id=r.request_id,
                url=r.url,
                platform=r.platform,
                status=r.status,
                result_count=r.result_count,
                created_at=r.created_at.isoformat(),
                completed_at=r.completed_at.isoformat() if r.completed_at else None
            ) for r in requests
        ],
        total=total
    )


@router.delete("/{request_id}")
async def cancel_scrape_request(
    request_id: str,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Cancel a pending scraping request."""
    statement = select(ScrapeRequest).where(
        ScrapeRequest.request_id == request_id,
        ScrapeRequest.user_id == current_user.id
    )
    scrape_request = session.exec(statement).first()
    
    if not scrape_request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scraping request not found"
        )
    
    if scrape_request.status not in [ScrapeStatus.PENDING, ScrapeStatus.PROCESSING]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending or processing requests can be cancelled"
        )
    
    scrape_request.status = ScrapeStatus.FAILED
    scrape_request.error_message = "Cancelled by user"
    session.add(scrape_request)
    session.commit()
    
    return {"message": "Scraping request cancelled"}
