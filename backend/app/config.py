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
    pinecone_api_key: str = ""
    pinecone_env: str = "us-west1-gcp-free"
    pinecone_index_name: str = "photos"

    # Security
    jwt_secret_key: str = "CHANGE_THIS_IN_PRODUCTION"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # Uploads
    upload_dir: str = "media"
    max_upload_size: int = 100 * 1024 * 1024  # 100MB default


# Global settings instance
settings = Settings()
