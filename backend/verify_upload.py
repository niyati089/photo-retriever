import httpx
import asyncio
import os
import zipfile
from pathlib import Path

BASE_URL = "http://localhost:8000"
EMAIL = "photographer@example.com"
PASSWORD = "password123"

async def verify():
    async with httpx.AsyncClient(timeout=30.0) as client:
        # 1. Login or Register
        print("Logging in...")
        try:
            resp = await client.post(f"{BASE_URL}/auth/login", data={"username": EMAIL, "password": PASSWORD})
            if resp.status_code == 401:
                print("Registering new photographer...")
                # Registration endpoint might be different, let's assume /users/
                reg_resp = await client.post(f"{BASE_URL}/users/", json={
                    "email": EMAIL,
                    "password": PASSWORD,
                    "full_name": "Test Photographer",
                    "role": "photographer"
                })
                print(f"Registration status: {reg_resp.status_code}")
                resp = await client.post(f"{BASE_URL}/auth/login", data={"username": EMAIL, "password": PASSWORD})
            
            resp.raise_for_status()
            token = resp.json()["access_token"]
            headers = {"Authorization": f"Bearer {token}"}
            print("Login successful.")
        except Exception as e:
            print(f"Login/Register failed: {e}")
            return

        # 2. Create an event
        print("Creating an event...")
        event_resp = await client.post(f"{BASE_URL}/api/v1/events/", headers=headers, params={"name": "Test Event"})
        event_resp.raise_for_status()
        event_id = event_resp.json()["id"]
        print(f"Created event with ID: {event_id}")

        # 3. Prepare test files
        test_dir = Path("test_assets")
        test_dir.mkdir(exist_ok=True)
        img_path = test_dir / "test_image.jpg"
        
        # Use an existing image if available, else create dummy
        source_img = Path("backend/media/events/6993127f5db469657e870117/raw/ab8186fd-966b-4408-85af-a0831c827acf.jpg")
        if source_img.exists():
            import shutil
            shutil.copy(source_img, img_path)
        else:
            with open(img_path, "wb") as f:
                f.write(b"dummy image data")

        # Create ZIP
        zip_path = test_dir / "test_archive.zip"
        with zipfile.ZipFile(zip_path, 'w') as z:
            z.write(img_path, arcname="image1.jpg")
            z.write(img_path, arcname="folder/image2.jpg")

        # 4. Upload individual images
        print("Uploading individual images...")
        with open(img_path, "rb") as f:
            files = [("files", ("image1.jpg", f, "image/jpeg"))]
            upload_resp = await client.post(f"{BASE_URL}/api/v1/events/{event_id}/upload", headers=headers, files=files)
            print(f"Upload status: {upload_resp.status_code}")
            print(upload_resp.json())

        # 5. Upload ZIP
        print("Uploading ZIP archive...")
        with open(zip_path, "rb") as f:
            files = [("files", ("archive.zip", f, "application/zip"))]
            upload_resp = await client.post(f"{BASE_URL}/api/v1/events/{event_id}/upload", headers=headers, files=files)
            print(f"ZIP Upload status: {upload_resp.status_code}")
            print(upload_resp.json())

if __name__ == "__main__":
    asyncio.run(verify())
