# backend/app/core/pinecone_client.py
from app.config import settings
from pinecone import Pinecone, ServerlessSpec

# Initialize Pinecone
pc = Pinecone(api_key=settings.pinecone_api_key)

# Create index if it doesn't exist
if settings.pinecone_index_name not in pc.list_indexes().names():
    pc.create_index(
        name=settings.pinecone_index_name,
        dimension=128,  # your embedding size
        metric="euclidean",
        spec=ServerlessSpec(cloud="aws", region=settings.pinecone_env)
    )

# Connect to the index using the Pinecone instance
index = pc.Index(settings.pinecone_index_name)

# Optional helper functions
def upsert_vectors(vectors: list[tuple[str, list[float], dict]]):
    """
    vectors: list of tuples (id, values, metadata)
    """
    return index.upsert(vectors=vectors)

def query_vectors(query_vector: list[float], top_k: int = 5):
    return index.query(vector=query_vector, top_k=top_k)
