from fastapi import APIRouter
from app.core.database import db

router = APIRouter()

@router.get("/db-test")
async def db_test():
    # Insert document
    result = await db.test_collection.insert_one({
        "message": "MongoDB connection works"
    })

    # Fetch document
    document = await db.test_collection.find_one(
        {"_id": result.inserted_id}
    )

    return {
        "inserted_id": str(result.inserted_id),
        "document": document["message"]
    }
