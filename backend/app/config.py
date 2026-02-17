"""Application configuration using Pydantic Settings."""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    app_name: str = "Photo Retriever API"
    environment: str = "development"
    log_level: str = "INFO"

    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000

    # CORS
    cors_origins: str = "http://localhost:3000,http://localhost:3001"

    @property
    def cors_origins_list(self) -> list[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.cors_origins.split(",")]

    # Database
    mongodb_url: str = "mongodb://localhost:27017/photo_retriever"

    # Vector Store
    pinecone_api_key: str  # loaded from .env
    pinecone_env: str      # loaded from .env
    pinecone_index_name: str  # loaded from .env


    # Security
    jwt_secret_key: str = "8aa566bea7d83789b67f714052758ef3ddacabe98810e46ad5f89685f4b95c91"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # Uploads
    upload_dir: str = "media"
    max_upload_size: int = 100 * 1024 * 1024  # 100MB default


# Global settings instance
settings = Settings()
