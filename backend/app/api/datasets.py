from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select

from app.core.database import get_session
from app.core.security import get_current_user
from app.models.user import User
from app.models.dataset import Dataset, Platform
from app.schemas.dataset import (
    DatasetCreate,
    DatasetResponse,
    DatasetListResponse,
    ExportRequest,
    ExportResponse
)
import secrets
from datetime import datetime, timedelta

router = APIRouter(prefix="/datasets", tags=["Datasets"])


@router.get("", response_model=DatasetListResponse)
async def list_datasets(
    platform: Optional[Platform] = None,
    category: Optional[str] = None,
    is_premium: Optional[bool] = None,
    search: Optional[str] = None,
    limit: int = Query(default=50, le=100),
    offset: int = Query(default=0, ge=0),
    session: Session = Depends(get_session)
):
    """Retrieve a list of all available datasets with filtering options."""
    statement = select(Dataset)
    
    # Apply filters
    if platform:
        statement = statement.where(Dataset.platform == platform)
    if category:
        statement = statement.where(Dataset.category == category)
    if is_premium is not None:
        statement = statement.where(Dataset.is_premium == is_premium)
    if search:
        statement = statement.where(
            Dataset.name.ilike(f"%{search}%") | Dataset.description.ilike(f"%{search}%")
        )
    
    # Get total count
    total_statement = select(Dataset)
    if platform:
        total_statement = total_statement.where(Dataset.platform == platform)
    if category:
        total_statement = total_statement.where(Dataset.category == category)
    if is_premium is not None:
        total_statement = total_statement.where(Dataset.is_premium == is_premium)
    if search:
        total_statement = total_statement.where(
            Dataset.name.ilike(f"%{search}%") | Dataset.description.ilike(f"%{search}%")
        )
    
    total = len(session.exec(total_statement).all())
    
    # Apply pagination
    statement = statement.offset(offset).limit(limit)
    datasets = session.exec(statement).all()
    
    return DatasetListResponse(
        datasets=[
            DatasetResponse(
                id=d.id,
                name=d.name,
                platform=d.platform,
                category=d.category,
                description=d.description,
                record_count=d.record_count,
                size=d.size,
                is_premium=d.is_premium,
                tags=d.tags,
                preview_data=d.preview_data,
                last_updated=d.last_updated.isoformat()
            ) for d in datasets
        ],
        total=total,
        page=(offset // limit) + 1,
        per_page=limit
    )


@router.get("/{dataset_id}", response_model=DatasetResponse)
async def get_dataset(
    dataset_id: int,
    preview: bool = Query(default=True),
    session: Session = Depends(get_session)
):
    """Get detailed information about a specific dataset."""
    statement = select(Dataset).where(Dataset.id == dataset_id)
    dataset = session.exec(statement).first()
    
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
    
    return DatasetResponse(
        id=dataset.id,
        name=dataset.name,
        platform=dataset.platform,
        category=dataset.category,
        description=dataset.description,
        record_count=dataset.record_count,
        size=dataset.size,
        is_premium=dataset.is_premium,
        tags=dataset.tags,
        preview_data=dataset.preview_data if preview else [],
        last_updated=dataset.last_updated.isoformat()
    )


@router.get("/{dataset_id}/preview")
async def get_dataset_preview(
    dataset_id: int,
    session: Session = Depends(get_session)
):
    """Get sample preview data for a dataset."""
    statement = select(Dataset).where(Dataset.id == dataset_id)
    dataset = session.exec(statement).first()
    
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
    
    return {"preview_data": dataset.preview_data}


@router.post("/{dataset_id}/download")
async def download_dataset(
    dataset_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Generate download link for dataset."""
    statement = select(Dataset).where(Dataset.id == dataset_id)
    dataset = session.exec(statement).first()
    
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
    
    # Check if user has access to premium datasets
    if dataset.is_premium and current_user.plan == "free":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Premium dataset requires a paid subscription"
        )
    
    # Generate download token
    download_token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=24)
    
    return {
        "download_url": f"/api/v1/downloads/{download_token}",
        "expires_at": expires_at.isoformat(),
        "dataset_name": dataset.name
    }


@router.get("/search")
async def search_datasets(
    q: str = Query(..., min_length=1),
    limit: int = Query(default=20, le=50),
    session: Session = Depends(get_session)
):
    """Search datasets by keyword/tags."""
    statement = select(Dataset).where(
        Dataset.name.ilike(f"%{q}%") | 
        Dataset.description.ilike(f"%{q}%") |
        Dataset.category.ilike(f"%{q}%")
    ).limit(limit)
    
    datasets = session.exec(statement).all()
    
    return {
        "results": [
            {
                "id": d.id,
                "name": d.name,
                "platform": d.platform,
                "category": d.category,
                "is_premium": d.is_premium
            } for d in datasets
        ],
        "count": len(datasets)
    }


@router.post("/{dataset_id}/export", response_model=ExportResponse)
async def export_dataset(
    dataset_id: int,
    export_request: ExportRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Export a dataset in specified format (CSV, JSON, Parquet)."""
    statement = select(Dataset).where(Dataset.id == dataset_id)
    dataset = session.exec(statement).first()
    
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
    
    if export_request.format not in ["csv", "json", "parquet"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid format. Supported: csv, json, parquet"
        )
    
    # Generate export
    export_id = f"exp_{secrets.token_urlsafe(16)}"
    expires_at = datetime.utcnow() + timedelta(hours=24)
    
    return ExportResponse(
        export_id=export_id,
        download_url=f"/api/v1/exports/{export_id}/download",
        expires_at=expires_at.isoformat()
    )


@router.post("", response_model=DatasetResponse, status_code=status.HTTP_201_CREATED)
async def create_dataset(
    dataset_data: DatasetCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Create a new dataset (admin only placeholder)."""
    # In production, add admin role check
    dataset = Dataset(
        name=dataset_data.name,
        platform=dataset_data.platform,
        category=dataset_data.category,
        description=dataset_data.description,
        record_count=dataset_data.record_count,
        size=dataset_data.size,
        is_premium=dataset_data.is_premium,
        tags=dataset_data.tags,
        preview_data=dataset_data.preview_data
    )
    session.add(dataset)
    session.commit()
    session.refresh(dataset)
    
    return DatasetResponse(
        id=dataset.id,
        name=dataset.name,
        platform=dataset.platform,
        category=dataset.category,
        description=dataset.description,
        record_count=dataset.record_count,
        size=dataset.size,
        is_premium=dataset.is_premium,
        tags=dataset.tags,
        preview_data=dataset.preview_data,
        last_updated=dataset.last_updated.isoformat()
    )
