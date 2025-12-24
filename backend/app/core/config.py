from pydantic_settings import BaseSettings
from pydantic import field_validator, Field
from functools import lru_cache
from typing import List, Union


# Default CORS origins
DEFAULT_CORS_ORIGINS = "http://localhost:5173,http://localhost:5000,http://localhost:3000"


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Database
    database_url: str = "postgresql://dataflow:dataflow@db:5432/dataflow"
    
    # JWT Authentication
    secret_key: str = "your-super-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # API Configuration
    api_v1_prefix: str = "/api/v1"
    project_name: str = "DataFlow API"
    
    # Debug mode - controls SQL logging
    debug: bool = False
    
    # CORS - accepts comma-separated origins from environment variable
    backend_cors_origins: Union[List[str], str] = Field(
        default=DEFAULT_CORS_ORIGINS,
        description="Allowed CORS origins. Accepts comma-separated string (e.g., 'http://localhost:5173,http://localhost:3000') or list of strings."
    )
    
    @field_validator("backend_cors_origins", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v) -> List[str]:
        if isinstance(v, str):
            # Accept comma-separated origins in env var
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            # Validate and normalize list items
            normalized = []
            for item in v:
                stripped = str(item).strip()
                if stripped:
                    normalized.append(stripped)
            return normalized
        # Fallback to default if invalid type
        return [i.strip() for i in DEFAULT_CORS_ORIGINS.split(",") if i.strip()]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()
