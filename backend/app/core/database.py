from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
from app.models.user import User

async def init_db():
    """Initialize database connection and Beanie models."""
    client = AsyncIOMotorClient(settings.mongodb_url)
    # The database name is parsed from the URL or defaults to 'test' if not present in connection string
    # We can explicitly get the database if needed, but client.get_database() works with the URI
    await init_beanie(database=client.get_default_database(), document_models=[User])
