from datetime import datetime
from typing import Optional, Dict, Any
from beanie import Document, Link
from pydantic import Field
from app.models.user import User

class Photo(Document):
    filename: str
    url: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    embedding_id: Optional[str] = None  # Reference to Pinecone Vector ID
    user_id: Optional[Link[User]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "photos"
        indexes = [
            "filename",
            "created_at",
            "user_id",
        ]
