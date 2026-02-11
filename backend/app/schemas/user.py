from typing import Optional
from pydantic import BaseModel, EmailStr
from app.models.user import UserRole
import uuid

from beanie import PydanticObjectId

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    is_active: Optional[bool] = True
    role: UserRole = UserRole.USER

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    role: Optional[UserRole] = None

class UserResponse(UserBase):
    id: PydanticObjectId
    
    class Config:
        populate_by_name = True
