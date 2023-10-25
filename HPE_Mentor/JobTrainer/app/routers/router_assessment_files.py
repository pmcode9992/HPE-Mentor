from typing import Annotated
from pathlib import Path
from fastapi import APIRouter, File, UploadFile
from fastapi.responses import  FileResponse, JSONResponse
import os

assessment_file_router = APIRouter(tags=["assessment/files"], responses={404:{"description" : "Not found"}}, prefix="/admin")

upload_directory = "/Users/pranav/HP_Intern/JobTrainer/app/assessments/"
assessment_file = "/Users/pranav/HP_Intern/JobTrainer/app/assessments/Assessment1.md"

@assessment_file_router.get("/file")
async def get_file(assessment_id: str, fname : str):
    return FileResponse(os.path.join(upload_directory, assessment_id, fname))

@assessment_file_router.post("/upload")
async def upload_file(file: UploadFile, fname: str,assessment_id: str):
    try:
        file.filename = fname
        directory_path = Path(os.path.join(upload_directory, assessment_id))
        directory_path.mkdir(parents=True, exist_ok=True)
        with open(directory_path / file.filename, "wb") as f:
            f.write(file.file.read())

        return JSONResponse(content={"message": "File uploaded successfully"})
    except Exception as e:
        return JSONResponse(content={"message": f"Error while uploading file: {str(e)}"}, status_code=500)
