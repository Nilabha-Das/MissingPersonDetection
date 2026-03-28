from datetime import datetime

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.config import settings
from app.core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)
from app.database.mongo import get_db
from app.models import (
    AuthResponse,
    GoogleLoginRequest,
    UserLoginRequest,
    UserPublic,
    UserSignupRequest,
)


router = APIRouter()
auth_scheme = HTTPBearer(auto_error=False)


def user_to_public(user_doc: dict) -> UserPublic:
    return UserPublic(
        id=str(user_doc["_id"]),
        name=user_doc["name"],
        email=user_doc["email"],
        provider=user_doc.get("provider", "email"),
        role=user_doc.get("role", "user"),
    )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(auth_scheme),
    db: AsyncIOMotorDatabase = Depends(get_db),
) -> dict:
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    user_id = decode_access_token(credentials.credentials)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    try:
        object_id = ObjectId(user_id)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token subject",
        ) from exc

    user = await db["users"].find_one({"_id": object_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user


async def get_current_authority(
    current_user: dict = Depends(get_current_user),
) -> dict:
    if current_user.get("role", "user") != "authority":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Authority access required",
        )
    return current_user


@router.post("/signup", response_model=AuthResponse)
async def signup(payload: UserSignupRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
    role = payload.role.strip().lower() if payload.role else "user"
    if role not in {"user", "authority"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role must be either 'user' or 'authority'",
        )

    existing = await db["users"].find_one({"email": payload.email.lower()})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    user_doc = {
        "name": payload.name.strip(),
        "email": payload.email.lower(),
        "password_hash": hash_password(payload.password),
        "provider": "email",
        "role": role,
        "created_at": datetime.utcnow(),
    }
    inserted = await db["users"].insert_one(user_doc)
    user_doc["_id"] = inserted.inserted_id

    token = create_access_token(str(inserted.inserted_id))
    return AuthResponse(access_token=token, user=user_to_public(user_doc))


@router.post("/login", response_model=AuthResponse)
async def login(payload: UserLoginRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
    user = await db["users"].find_one({"email": payload.email.lower()})
    if not user or not user.get("password_hash"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(str(user["_id"]))
    return AuthResponse(access_token=token, user=user_to_public(user))


@router.post("/google", response_model=AuthResponse)
async def login_with_google(
    payload: GoogleLoginRequest,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    if not settings.google_client_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google login is not configured",
        )

    try:
        info = google_id_token.verify_oauth2_token(
            payload.id_token,
            google_requests.Request(),
            settings.google_client_id,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token",
        ) from exc

    email = str(info.get("email", "")).lower().strip()
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account email is unavailable",
        )

    name = str(info.get("name") or email.split("@")[0]).strip()

    user = await db["users"].find_one({"email": email})
    if not user:
        user = {
            "name": name,
            "email": email,
            "provider": "google",
            "role": "user",
            "google_sub": info.get("sub"),
            "created_at": datetime.utcnow(),
        }
        inserted = await db["users"].insert_one(user)
        user["_id"] = inserted.inserted_id

    token = create_access_token(str(user["_id"]))
    return AuthResponse(access_token=token, user=user_to_public(user))


@router.get("/me", response_model=UserPublic)
async def me(current_user: dict = Depends(get_current_user)):
    return user_to_public(current_user)
