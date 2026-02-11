from enum import Enum
from typing import Optional
from datetime import datetime, timezone
from beanie import Document, Indexed
from pydantic import EmailStr, Field

class UserRole(str, Enum):
    USER = "user"
    PHOTOGRAPHER = "photographer"
    ADMIN = "admin"

class User(Document):
    email: Indexed(EmailStr, unique=True) # type: ignore
    hashed_password: str
    full_name: Optional[str] = None
    role: UserRole = UserRole.USER
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    class Settings:
        name = "users"
