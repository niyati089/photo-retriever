# backend/main.py
from contextlib import asynccontextmanager
from typing import AsyncGenerator, List, Dict

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.config import settings
from app.core.logging import configure_logging, get_logger
from app.core.database import init_db, db, init_pinecone
from app.routes.health import router as health_router
from app.routes import auth, users
from app.core.pinecone_client import index  # Pinecone index

logger = get_logger(__name__)

# -----------------------------
# Lifespan for FastAPI
# -----------------------------
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    configure_logging(settings.log_level)
    await init_db()            # Initialize MongoDB + Beanie
    init_pinecone()            # Initialize Pinecone index

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
# FastAPI App
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
# Routers
# -----------------------------
app.include_router(health_router, tags=["Health"])
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/users", tags=["Users"])
from app.routes import media
app.include_router(media.router, prefix="/api/v1/events", tags=["Media"])

# -----------------------------
# Root Endpoint
# -----------------------------
@app.get("/")
async def root() -> dict[str, str]:
    return {
        "name": settings.app_name,
        "version": "0.1.0",
        "docs": "/docs",
    }

# -----------------------------
# Pinecone Example Query Endpoint
# -----------------------------
@app.get("/search")
async def search():
    if not index:
        raise HTTPException(status_code=500, detail="Pinecone not initialized")
    
    # Use correct embedding dimension
    query_vector = [0.1] * 128
    result = index.query(vector=query_vector, top_k=5)
    return result

# -----------------------------
# Push vectors safely
# -----------------------------
class VectorItem(BaseModel):
    id: str
    values: List[float]
    metadata: Dict[str, str] = {}

@app.post("/push")
async def push_vectors(vectors: List[VectorItem]):
    if not index:
        raise HTTPException(status_code=500, detail="Pinecone not initialized")
    try:
        to_upsert = [(v.id, v.values, v.metadata) for v in vectors]
        # Use await if your Pinecone client supports async upsert
        await index.upsert(vectors=to_upsert)
        return {"status": "success", "count": len(vectors)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
