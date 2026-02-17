from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
try:
    from pinecone import Pinecone, ServerlessSpec
except ImportError:
    Pinecone = None
    ServerlessSpec = None
    print("Warning: pinecone-client not installed or failed to import")
from app.config import settings
from app.models.user import User
from app.models.photo import Photo
from app.models.event import Event
from app.models.image import ImageMetadata
from app.core.logging import get_logger

logger = get_logger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    pinecone: Pinecone = None
    pinecone_index = None

db = Database()

async def init_mongo():
    """Initialize MongoDB connection and Beanie models."""
    try:
        db.client = AsyncIOMotorClient(settings.mongodb_url)
        # Verify connection
        await db.client.admin.command('ping')
        db.database = db.client.get_default_database()
        db.test_collection = db.database["test_collection"]

        logger.info("Successfully connected to MongoDB")
        
        await init_beanie(
            database=db.database,
            document_models=[
                User,
                Photo,
                Event,
                ImageMetadata,
            ]
        )
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise e

def init_pinecone():
    """Initialize Pinecone client and index."""
    if Pinecone is None:
        logger.warning("Pinecone module not found. Vector search disabled.")
        return

    try:
        if not settings.pinecone_api_key:
            logger.warning("Pinecone API key not found. Vector search will be disabled.")
            return

        db.pinecone = Pinecone(api_key=settings.pinecone_api_key)
        
        # Check if index exists, create if not
        existing_indexes = [index.name for index in db.pinecone.list_indexes()]
        
        if settings.pinecone_index_name not in existing_indexes:
            logger.info(f"Creating Pinecone index: {settings.pinecone_index_name}")
            db.pinecone.create_index(
                name=settings.pinecone_index_name,
                dimension=128,  # Face recognition embedding dimension (e.g., for dlib/face_recognition)
                metric="euclidean",
                spec=ServerlessSpec(
                    cloud="aws",
                    region="us-east-1"
                )
            )
        
        db.pinecone_index = db.pinecone.Index(settings.pinecone_index_name)
        logger.info("Successfully connected to Pinecone")
        
    except Exception as e:
        logger.error(f"Failed to connect to Pinecone: {e}")
        # Don't raise here to allow app to start without vector search if needed, 
        # or raise if it's critical. For now, we log error.

async def init_db():
    """Initialize all database connections."""
    await init_mongo()
    init_pinecone()
