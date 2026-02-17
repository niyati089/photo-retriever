from datetime import datetime
from typing import Optional
from beanie import Document, Indexed, Link
from pydantic import Field
from app.models.user import User
from app.models.event import Event

class ImageMetadata(Document):
    event_id: Link[Event]
    file_name: str
    file_path: str
    upload_timestamp: datetime = Field(default_factory=datetime.utcnow)
    status: str = "UPLOADED"
    photographer_id: Link[User]

    class Settings:
        name = "image_metadata"
        indexes = [
            "event_id",
            "photographer_id",
            "upload_timestamp",
            "status",
        ]
