from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
    verify_token
)


router = APIRouter()

# Temporary fake user
fake_user = {
    "email": "admin@example.com",
    "hashed_password": hash_password("password123"),
    "role": "admin"
}


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/login")
def login(data: LoginRequest):

    fake_user = {
        "email": "admin@example.com",
        "password": "password123",
        "role": "admin"
    }

    if data.email != fake_user["email"] or data.password != fake_user["password"]:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "sub": data.email,
        "role": fake_user["role"]
    })

    return {"access_token": token}



@router.get("/protected")
def protected(user=Depends(verify_token)):
    return {
        "message": "Access granted",
        "user": user
    }
