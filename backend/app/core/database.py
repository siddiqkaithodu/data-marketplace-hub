from sqlmodel import SQLModel, create_engine, Session
from app.core.config import settings

# Create engine - echo mode controlled by debug setting
engine = create_engine(
    settings.database_url,
    echo=settings.debug
)


def create_db_and_tables():
    """Create all database tables."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Get database session."""
    with Session(engine) as session:
        yield session
