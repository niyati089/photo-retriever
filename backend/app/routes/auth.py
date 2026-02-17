from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from app.models.user import User
from app.core.security import create_access_token, verify_password, hash_password
from passlib.context import CryptContext

router = APIRouter()

# ---------- Registration Endpoint ----------
@router.post("/register")
async def register(email: str, password: str, role: str = "user"):
    # Check if user already exists
    existing_user = await User.find_one(User.email == email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )

    # Hash the password
    hashed_pw = hash_password(password)

    # Create user object
    user = User(email=email, hashed_password=hashed_pw, role=role)
    
    # Save to database
    await user.insert()

    return {
        "status": "success",
        "email": user.email,
        "role": user.role
    }

# ---------- Login Endpoint ----------
@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await User.find_one(User.email == form_data.username)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    token = create_access_token({
        "sub": user.email,
        "role": user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }

# ---------- Login Test Endpoint (for debugging password verification) ----------
@router.post("/login-test")
async def login_test(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await User.find_one(User.email == form_data.username)
    if not user:
        return {"status": "no user found", "email": form_data.username}

    # Use same scheme as your hashed passwords
    pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")
    result = pwd_context.verify(form_data.password, user.hashed_password)

    return {
        "status": "user found",
        "hashed_password": user.hashed_password,
        "password_match": result
    }
