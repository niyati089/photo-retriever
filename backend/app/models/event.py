from datetime import datetime
from typing import Optional
from beanie import Document, Indexed, Link
from pydantic import Field
from app.models.user import User

class Event(Document):
    name: Indexed(str)
    description: Optional[str] = None
    photographer_id: Link[User]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "events"
        indexes = [
            "name",
            "photographer_id",
            "created_at",
        ]
