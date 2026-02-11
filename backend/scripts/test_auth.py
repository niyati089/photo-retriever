import asyncio
import sys
import os
from datetime import datetime

# Add the parent directory to sys.path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import init_db
from app.models.user import User, UserRole
from app.core.security import get_password_hash, verify_password, create_access_token
from app.config import settings
from jose import jwt

async def main():
    print("--- Starting Auth Verification Script ---")
    
    # 1. Initialize DB
    print("\n1. Initializing Database...")
    try:
        await init_db()
        print("   Database initialized successfully.")
    except Exception as e:
        print(f"   ERROR: Failed to initialize database: {e}")
        return

    # 2. Cleanup (optional, careful in prod)
    # await User.find_all().delete()
    
    # 3. Create Users (User, Admin)
    print("\n2. Creating Test Users...")
    test_user_email = f"testuser_{int(datetime.now().timestamp())}@example.com"
    test_admin_email = f"admin_{int(datetime.now().timestamp())}@example.com"
    password = "password123"
    hashed_pw = get_password_hash(password)

    user = User(email=test_user_email, hashed_password=hashed_pw, role=UserRole.USER)
    admin = User(email=test_admin_email, hashed_password=hashed_pw, role=UserRole.ADMIN)
    
    await user.create()
    await admin.create()
    print(f"   Created User: {user.email}")
    print(f"   Created Admin: {admin.email}")

    # 4. Login / Verify Password
    print("\n3. Verifying Password Login...")
    db_user = await User.find_one(User.email == test_user_email)
    if verify_password(password, db_user.hashed_password):
        print("   Password verification SUCCESS")
    else:
        print("   Password verification FAILED")

    # 5. Generate Token
    print("\n4. Generating Access Token...")
    token = create_access_token(subject=user.email)
    print(f"   Token generated (prefix): {token[:20]}...")

    # 6. Verify Token
    print("\n5. Verifying Token...")
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        if payload.get("sub") == user.email:
             print(f"   Token verification SUCCESS. Subject: {payload.get('sub')}")
        else:
             print(f"   Token verification FAILED. Subject mismatch.")
    except Exception as e:
        print(f"   Token verification ERROR: {e}")
        
    print("\n--- Verification Complete ---")

if __name__ == "__main__":
    asyncio.run(main())
