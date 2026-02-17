from typing import List, Optional
from pydantic import BaseModel

class UploadResponse(BaseModel):
    event_id: str
    total_uploaded: int
    failed_files: List[str]
    status: str = "UPLOAD_COMPLETED"

class ErrorResponse(BaseModel):
    detail: str
