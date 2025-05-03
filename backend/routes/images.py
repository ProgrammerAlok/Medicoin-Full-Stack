from typing import List
from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
import os

router = APIRouter(
  prefix="/image"
)

# Optional: Create a directory to save uploaded files
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/u")
async def handle_image_upload(files: List[UploadFile] = File(...)):
  image_paths: List[str] = []

  # print(files)

  for file in files:
    file_path = f"{UPLOAD_DIR}/{file.filename}"
    print(file_path)
    print(file)
    with open(file_path, "wb") as f:
      f.write(await file.read())
      image_paths.append(file_path)

  return JSONResponse(
    {
      "data": image_paths,
      "message": "images"
    },
    200
  )
