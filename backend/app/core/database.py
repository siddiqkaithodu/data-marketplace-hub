from sqlmodel import SQLModel, create_engine, Session
from app.core.config import settings

# Lazy engine initialization — avoids crash at import time if DB is unreachable
_engine = None


def get_engine():
    """Get or create the database engine (lazy singleton)."""
    global _engine
    if _engine is None:
        _engine = create_engine(
            settings.database_url,
            echo=settings.debug,
            # Cloud SQL / production resilience settings
            pool_pre_ping=True,       # Verify connections before use
            pool_size=5,              # Cloud Run concurrency-friendly
            max_overflow=10,
            connect_args={
                "connect_timeout": 10  # Don't hang forever on bad connections
            }
        )
    return _engine


def create_db_and_tables():
    """Create all database tables."""
    SQLModel.metadata.create_all(get_engine())


def get_session():
    """Get database session."""
    with Session(get_engine()) as session:
        yield session
