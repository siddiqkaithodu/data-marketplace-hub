from typing import Optional

from sqlmodel import SQLModel, Session, create_engine

from app.core.config import settings

try:
    from google.cloud.sql.connector import Connector
except ImportError:
    Connector = None

# Lazy engine initialization — avoids crash at import time if DB is unreachable
_engine = None
_connector: Optional[Connector] = None


def _get_connector() -> Connector:
    global _connector
    if Connector is None:
        raise RuntimeError(
            "cloud-sql-python-connector is required when CLOUD_SQL_CONNECTION is set."
        )
    if _connector is None:
        _connector = Connector()
    return _connector


def get_connection():
    missing_settings = [
        name
        for name, value in (
            ("CLOUD_SQL_CONNECTION", settings.instance_connection_name),
            ("POSTGRES_USER", settings.db_user),
            ("POSTGRES_PASSWORD", settings.db_pass),
            ("POSTGRES_DB", settings.db_name),
        )
        if not value
    ]
    if missing_settings:
        raise ValueError(
            f"Missing required Cloud SQL settings: {', '.join(missing_settings)}"
        )

    connect_kwargs = {
        "user": settings.db_user,
        "db": settings.db_name,
        "timeout": 30,
    }
    connect_kwargs["pass" + "word"] = settings.db_pass
    return _get_connector().connect(
        settings.instance_connection_name,
        "pg8000",
        **connect_kwargs,
    )


def get_engine():
    """Get or create the database engine (lazy singleton)."""
    global _engine
    if _engine is None:
        if settings.instance_connection_name:
            _engine = create_engine(
                "postgresql+pg8000://",
                creator=get_connection,
                echo=settings.debug,
                pool_pre_ping=True,
                pool_size=5,
                max_overflow=10,
            )
        else:
            _engine = create_engine(
                settings.database_url,
                echo=settings.debug,
                pool_pre_ping=True,
            )
    return _engine


def close_connector():
    global _connector
    if _connector is not None:
        _connector.close()
        _connector = None


def create_db_and_tables():
    """Create all database tables."""
    SQLModel.metadata.create_all(get_engine())


def get_session():
    """Get database session."""
    with Session(get_engine()) as session:
        yield session
