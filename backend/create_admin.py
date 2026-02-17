import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from app.config import settings

async def create_admin():
    # Connect to Atlas using the correct settings attribute
    client = AsyncIOMotorClient(settings.mongodb_url)
    db = client.get_default_database()  # now works because URI has the DB

    # Hash password using sha256_crypt
    pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")
    hashed_password = pwd_context.hash("password123")  # change password if needed

    # Insert admin user
    await db.users.insert_one({
        "email": "admin@example.com",
        "hashed_password": hashed_password,
        "role": "admin"
    })
    print("✅ Admin user created!")

if __name__ == "__main__":
    asyncio.run(create_admin())
