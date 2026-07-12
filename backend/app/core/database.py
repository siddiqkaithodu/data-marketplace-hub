from google.cloud.sql.connector import Connector
from sqlmodel import SQLModel, create_engine, Session
from app.core.config import settings
INSTANCE_CONNECTION_NAME =settings.instance_connection_name
DB_USER = settings.db_user
DB_PASS = settings.db_pass
DB_NAME = settings.db_name
# Lazy engine initialization — avoids crash at import time if DB is unreachable
_engine = None

connector = Connector()
# Define the connection creator function
def get_connection():
    # Change "pg8000" to "pymysql" if you are using MySQL
    conn = connector.connect(
        INSTANCE_CONNECTION_NAME,
        "pg8000",  
        user=DB_USER,
        password=DB_PASS,
        db=DB_NAME
    )
    return conn

def get_engine():
    """Get or create the database engine (lazy singleton)."""
    global _engine
    if _engine is None:
        _engine = create_engine(
"postgresql+pg8000://",creator=get_connection,
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
