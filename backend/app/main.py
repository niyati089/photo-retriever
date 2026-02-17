"""FastAPI application entry point."""
from contextlib import asynccontextmanager
from typing import AsyncGenerator, List, Dict

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.config import settings
from app.core.logging import configure_logging, get_logger
from app.routes.health import router as health_router

import os
from dotenv import load_dotenv
import pinecone

logger = get_logger(__name__)

# -----------------------------
# Pinecone Setup
# -----------------------------
load_dotenv()
API_KEY = os.getenv("PINECONE_API_KEY")
ENV = os.getenv("PINECONE_ENVIRONMENT")
INDEX_NAME = "your-index-name"  # Replace with your index name

pinecone.init(api_key=API_KEY, environment=ENV)
index = pinecone.Index(INDEX_NAME)

# -----------------------------
# Lifespan event for FastAPI
# -----------------------------
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    configure_logging(settings.log_level)
    from app.core.database import init_db, db
    await init_db()
    
    mongo_status = "Connected" if db.client else "Failed"
    pinecone_status = "Connected" if index else "Not Configured/Failed"
    
    logger.info(
        "application_startup",
        app_name=settings.app_name,
        environment=settings.environment,
        mongo_status=mongo_status,
        pinecone_vector_db=pinecone_status,
    )
    
    yield
    
    logger.info("application_shutdown")

# -----------------------------
# Create FastAPI app
# -----------------------------
app = FastAPI(
    title=settings.app_name,
    description="Backend API for intelligent photo retrieval system",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Register routers
# -----------------------------
app.include_router(health_router, tags=["Health"])
from app.routes import auth, users
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/users", tags=["Users"])
from app.routes.test_db import router as test_router
app.include_router(test_router, tags=["Testing"])
from app.routes.test_pinecone import router as pinecone_test_router
app.include_router(pinecone_test_router, tags=["Testing"])
from app.routes import media
app.include_router(media.router, prefix="/api/v1/events", tags=["Media"])

# -----------------------------
# Root endpoint
# -----------------------------
@app.get("/")
async def root() -> dict[str, str]:
    return {
        "name": settings.app_name,
        "version": "0.1.0",
        "docs": "/docs",
    }

# -----------------------------
# Example Pinecone query endpoint
# -----------------------------
@app.get("/search")
async def search():
    query_vector = [0.1, 0.2, 0.3]  # replace with real query embedding
    result = index.query(vector=query_vector, top_k=5)
    return result

# -----------------------------
# Safe endpoint to push vectors
# -----------------------------
class VectorItem(BaseModel):
    id: str
    values: List[float]
    metadata: Dict[str, str] = {}

@app.post("/push")
async def push_vectors(vectors: List[VectorItem]):
    """
    Push vectors to Pinecone safely.
    API key is never exposed; it uses server-side .env.
    """
    try:
        to_upsert = [(v.id, v.values, v.metadata) for v in vectors]
        index.upsert(vectors=to_upsert)
        return {"status": "success", "count": len(vectors)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
