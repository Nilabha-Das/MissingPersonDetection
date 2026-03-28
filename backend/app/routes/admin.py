from typing import List

from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.database.mongo import get_db
from app.routes.auth import get_current_authority


router = APIRouter()


@router.get("/alerts")
async def list_alerts(
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_authority),
):
    del current_user
    cursor = db["alerts"].find().sort("created_at", -1)
    alerts: List[dict] = []
    async for alert in cursor:
        alert["_id"] = str(alert["_id"])
        alerts.append(alert)
    return {"alerts": alerts}


@router.get("/missing")
async def list_missing_reports(
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_authority),
):
    del current_user
    cursor = db["missing_reports"].find().sort("created_at", -1)
    items: List[dict] = []
    async for item in cursor:
        item["_id"] = str(item["_id"])
        items.append(item)
    return {"missing_reports": items}


@router.get("/found")
async def list_found_reports(
    db: AsyncIOMotorDatabase = Depends(get_db),
    current_user: dict = Depends(get_current_authority),
):
    del current_user
    cursor = db["found_reports"].find().sort("created_at", -1)
    items: List[dict] = []
    async for item in cursor:
        item["_id"] = str(item["_id"])
        items.append(item)
    return {"found_reports": items}
