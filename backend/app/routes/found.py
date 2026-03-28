import os
import uuid
from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database.mongo import get_db
from app.models import FoundPerson, FoundPersonCreate, MatchResult
from app.routes.auth import get_current_user
from app.services.face_recognition import extract_embedding, cosine_similarity
from app.core.config import settings


router = APIRouter()


@router.post("/", response_model=dict)
async def create_found_person(
    found_location: str | None = Form(default=None),
    contact_info: str | None = Form(default=None),
    additional_info: str | None = Form(default=None),
    image: UploadFile = File(...),
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    del current_user
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File must be an image")

    ext = os.path.splitext(image.filename or "")[1] or ".jpg"
    filename = f"{uuid.uuid4()}{ext}"
    save_path = os.path.join("uploads", "found", filename)

    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    with open(save_path, "wb") as f:
        f.write(await image.read())

    try:
        embedding = extract_embedding(save_path)
    except Exception as e:
        try:
            os.remove(save_path)
        except OSError:
            pass
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    doc = {
        "found_location": found_location,
        "contact_info": contact_info,
        "additional_info": additional_info,
        "image_path": save_path,
        "embedding": embedding,
        "created_at": datetime.utcnow(),
    }

    result = await db["found_reports"].insert_one(doc)
    doc["_id"] = str(result.inserted_id)

    matches: List[MatchResult] = []
    cursor = db["missing_reports"].find({}, {"embedding": 1})
    async for missing in cursor:
        sim = cosine_similarity(embedding, missing.get("embedding", []))
        if sim >= settings.similarity_threshold:
            match = MatchResult(
                missing_id=str(missing["_id"]),
                found_id=doc["_id"],
                similarity=sim,
            )
            matches.append(match)
            await db["alerts"].insert_one(
                {
                    "missing_id": match.missing_id,
                    "found_id": match.found_id,
                    "similarity": match.similarity,
                    "created_at": datetime.utcnow(),
                }
            )

    return {"report": doc, "matches": [m.dict() for m in matches]}
