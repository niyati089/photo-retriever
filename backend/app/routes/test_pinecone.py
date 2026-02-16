from fastapi import APIRouter
from app.core.database import db

router = APIRouter()

@router.get("/pinecone-test")
async def pinecone_test():

    if db.pinecone_index is None:
        return {"error": "Pinecone not initialized"}

    test_vector = [0.1] * 128

    db.pinecone_index.upsert(
        vectors=[{
            "id": "test-id",
            "values": test_vector
        }]
    )

    result = db.pinecone_index.query(
        vector=test_vector,
        top_k=1
    )

    # Convert to serializable format
    return {
        "message": "Pinecone working",
        "matches": [
            {
                "id": match["id"],
                "score": match["score"]
            }
            for match in result["matches"]
        ]
    }
