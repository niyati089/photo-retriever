from fastapi import APIRouter, HTTPException, Depends
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.core.security import hash_password
from app.api.deps import get_current_active_user

router = APIRouter()

@router.post("/", response_model=UserResponse)
async def create_user(user_in: UserCreate):
    """
    Create new user.
    """
    user = await User.find_one(User.email == user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    hashed_password = hash_password(user_in.password)
    user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        full_name=user_in.full_name,
        role=user_in.role,
    )
    await user.insert()
    return user

@router.get("/me", response_model=UserResponse)
async def read_user_me(current_user: User = Depends(get_current_active_user)):
    """
    Get current user.
    """
    return current_user

from typing import List
from app.api.deps import RoleChecker

allow_admin = RoleChecker(["admin"])

@router.get("/", response_model=List[UserResponse], dependencies=[Depends(allow_admin)])
async def read_users():
    """
    Get all users. Only for admins.
    """
    return await User.find_all().to_list()
