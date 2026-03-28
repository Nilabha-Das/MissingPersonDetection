from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import AsyncGenerator

from app.core.config import settings


_client: AsyncIOMotorClient | None = None


def get_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(settings.mongodb_uri)
    return _client


def get_database() -> AsyncIOMotorDatabase:
    client = get_client()
    return client[settings.mongodb_db]


async def get_db() -> AsyncGenerator[AsyncIOMotorDatabase, None]:
    db = get_database()
    try:
        yield db
    finally:
        # Motor manages connection pooling; nothing special needed here
        pass
