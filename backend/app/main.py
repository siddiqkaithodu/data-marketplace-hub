from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import create_db_and_tables
from app.api import auth, datasets, scrape, account, webhooks

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    create_db_and_tables()
    yield
    # Shutdown


app = FastAPI(
    title=settings.project_name,
    openapi_url=f"{settings.api_v1_prefix}/openapi.json",
    docs_url=f"{settings.api_v1_prefix}/docs",
    redoc_url=f"{settings.api_v1_prefix}/redoc",
    lifespan=lifespan
)

# Configure CORS
# Use regex pattern for flexible localhost/127.0.0.1 matching in development
# This allows any port on localhost or 127.0.0.1
cors_regex_pattern = r"https?://(localhost|127\.0\.0\.1)(:\d+)?"
logger.info(f"Configuring CORS with regex pattern: {cors_regex_pattern}")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=cors_regex_pattern,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Include routers
app.include_router(auth.router, prefix=settings.api_v1_prefix)
app.include_router(datasets.router, prefix=settings.api_v1_prefix)
app.include_router(scrape.router, prefix=settings.api_v1_prefix)
app.include_router(account.router, prefix=settings.api_v1_prefix)
app.include_router(account.billing_router, prefix=settings.api_v1_prefix)
app.include_router(webhooks.router, prefix=settings.api_v1_prefix)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": settings.project_name,
        "version": "1.0.0",
        "docs": f"{settings.api_v1_prefix}/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
