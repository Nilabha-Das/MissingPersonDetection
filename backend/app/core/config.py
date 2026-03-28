from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Find Me AI"
    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_db: str = "find_me_ai"
    jwt_secret_key: str = "change-this-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    google_client_id: str | None = None
    embedding_model: str = "VGG-Face"  # DeepFace model name
    similarity_threshold: float = 0.7

    class Config:
        env_file = ".env"


settings = Settings()
