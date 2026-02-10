"""Health check endpoint for monitoring and uptime checks."""
from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check() -> dict[str, str]:
    """
    Health check endpoint.
    
    Returns:
        Dictionary with status indicating the service is healthy
    """
    return {"status": "healthy"}
