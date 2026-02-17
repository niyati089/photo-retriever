import os
import shutil
import zipfile
import uuid
import tempfile
from datetime import datetime
from typing import List, Tuple
from fastapi import UploadFile, HTTPException
from app.config import settings
from app.models.event import Event
from app.models.image import ImageMetadata
from app.core.logging import get_logger

logger = get_logger(__name__)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}

class UploadService:
    def __init__(self):
        self.base_upload_dir = settings.upload_dir

    async def handle_uploads(self, event_id: str, files: List[UploadFile], photographer_id: str) -> Tuple[int, List[str]]:
        """Handles multiple files (images or ZIPs)."""
        total_uploaded = 0
        failed_files = []

        # Ensure event exists
        event = await Event.get(event_id)
        if not event:
            raise HTTPException(status_code=404, detail=f"Event {event_id} not found")

        # Create event raw directory
        event_raw_dir = os.path.join(self.base_upload_dir, "events", event_id, "raw")
        os.makedirs(event_raw_dir, exist_ok=True)

        for file in files:
            file_ext = os.path.splitext(file.filename)[1].lower()
            
            if file_ext == ".zip":
                uploaded, failed = await self._process_zip(file, event_id, event_raw_dir, photographer_id)
                total_uploaded += uploaded
                failed_files.extend(failed)
            elif file_ext in ALLOWED_EXTENSIONS:
                try:
                    await self._save_image(file, event_id, event_raw_dir, photographer_id)
                    total_uploaded += 1
                except Exception as e:
                    logger.error(f"Failed to save image {file.filename}: {e}")
                    failed_files.append(file.filename)
            else:
                failed_files.append(f"{file.filename} (Unsupported type)")

        return total_uploaded, failed_files

    async def _save_image(self, file: UploadFile, event_id: str, target_dir: str, photographer_id: str) -> None:
        """Saves a single image and creates DB entry."""
        # Generate unique filename to avoid collisions
        unique_name = f"{uuid.uuid4()}{os.path.splitext(file.filename)[1].lower()}"
        file_path = os.path.join(target_dir, unique_name)

        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Create DB entry
        metadata = ImageMetadata(
            event_id=event_id,
            file_name=file.filename,
            file_path=file_path,
            photographer_id=photographer_id,
            status="UPLOADED"
        )
        await metadata.insert()

    async def _process_zip(self, zip_file: UploadFile, event_id: str, target_dir: str, photographer_id: str) -> Tuple[int, List[str]]:
        """Extracts ZIP and processes images within."""
        uploaded_count = 0
        failed_files = []

        with tempfile.TemporaryDirectory() as temp_dir:
            temp_zip_path = os.path.join(temp_dir, "upload.zip")
            
            # Save ZIP temporarily
            with open(temp_zip_path, "wb") as buffer:
                shutil.copyfileobj(zip_file.file, buffer)

            try:
                with zipfile.ZipFile(temp_zip_path, 'r') as zip_ref:
                    # Scan for images
                    for member in zip_ref.infolist():
                        if member.is_dir():
                            continue
                        
                        filename = os.path.basename(member.filename)
                        if not filename:
                            continue
                            
                        file_ext = os.path.splitext(filename)[1].lower()
                        if file_ext in ALLOWED_EXTENSIONS:
                            try:
                                # Generate unique path in the event folder
                                unique_name = f"{uuid.uuid4()}{file_ext}"
                                dest_path = os.path.join(target_dir, unique_name)
                                
                                # Extract and save
                                with zip_ref.open(member) as source, open(dest_path, "wb") as target:
                                    shutil.copyfileobj(source, target)
                                
                                # DB entry
                                metadata = ImageMetadata(
                                    event_id=event_id,
                                    file_name=filename,
                                    file_path=dest_path,
                                    photographer_id=photographer_id,
                                    status="UPLOADED"
                                )
                                await metadata.insert()
                                uploaded_count += 1
                            except Exception as e:
                                logger.error(f"Error processing {member.filename} from ZIP: {e}")
                                failed_files.append(member.filename)
            except zipfile.BadZipFile:
                logger.error(f"Corrupted ZIP file: {zip_file.filename}")
                failed_files.append(f"{zip_file.filename} (Corrupted ZIP)")
            except Exception as e:
                logger.error(f"Unexpected error processing ZIP {zip_file.filename}: {e}")
                failed_files.append(f"{zip_file.filename} (Extraction error)")

        return uploaded_count, failed_files

upload_service = UploadService()
