from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.routes import missing, found, admin, auth


def create_app() -> FastAPI:
    app = FastAPI(
        title="Find Me AI - Missing & Found Platform",
        version="0.1.0",
        docs_url="/",
        redoc_url=None,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Ensure upload directories exist
    os.makedirs("uploads/missing", exist_ok=True)
    os.makedirs("uploads/found", exist_ok=True)

    # Mount uploads as static (optional: for admin/debug)
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

    # Routers
    app.include_router(missing.router, prefix="/missing", tags=["missing"])
    app.include_router(found.router, prefix="/found", tags=["found"])
    app.include_router(admin.router, prefix="/admin", tags=["admin"])
    app.include_router(auth.router, prefix="/auth", tags=["auth"])

    return app


app = create_app()
