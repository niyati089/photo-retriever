from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Request
from app.api.deps import get_current_active_user, RoleChecker
from app.models.user import User
from app.models.event import Event
from app.schemas.media import UploadResponse, ErrorResponse
from app.services.upload_service import upload_service
from app.config import settings

router = APIRouter()

allow_photographer = RoleChecker(["photographer", "admin"])

@router.post("/{event_id}/upload", response_model=UploadResponse, status_code=201)
async def bulk_upload(
    event_id: str,
    request: Request,
    files: List[UploadFile] = File(...),
    current_user: User = Depends(allow_photographer)
):
    """
    Bulk upload images or ZIP files for a specific event.
    Requires photographer or admin role.
    """
    # 1. Validate Content-Length if present
    content_length = request.headers.get("content-length")
    if content_length and int(content_length) > settings.max_upload_size:
        raise HTTPException(
            status_code=413,
            detail=f"Upload too large. Maximum size is {settings.max_upload_size // (1024*1024)}MB"
        )

    # 2. Check if event exists
    event = await Event.get(event_id)
    if not event:
        raise HTTPException(status_code=404, detail=f"Event {event_id} not found")

    # 3. Process uploads via service
    total_uploaded, failed_files = await upload_service.handle_uploads(
        event_id=event_id,
        files=files,
        photographer_id=str(current_user.id)
    )

    if total_uploaded == 0 and failed_files:
        raise HTTPException(status_code=400, detail=f"Failed to upload any files: {', '.join(failed_files)}")

    return UploadResponse(
        event_id=event_id,
        total_uploaded=total_uploaded,
        failed_files=failed_files,
        status="UPLOAD_COMPLETED"
    )

# Internal helper route to create an event for testing (Optional but useful)
@router.post("/events", status_code=201, dependencies=[Depends(allow_photographer)])
async def create_event(name: str, current_user: User = Depends(allow_photographer)):
    event = Event(name=name, photographer_id=current_user.id) # type: ignore
    await event.insert()
    return {"id": str(event.id), "name": event.name}
