"""Application configuration loaded from environment variables."""
import os
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / ".env")


class Settings:
    MONGO_URL: str = os.environ["MONGO_URL"]
    DB_NAME: str = os.environ["DB_NAME"]
    JWT_SECRET: str = os.environ["JWT_SECRET"]
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ADMIN_EMAIL: str = os.environ.get("ADMIN_EMAIL", "admin@fulxerpro.com")
    ADMIN_PASSWORD: str = os.environ.get("ADMIN_PASSWORD", "Admin@12345")
    FRONTEND_URL: str = os.environ.get("FRONTEND_URL", "http://localhost:3000")
    CORS_ORIGINS: list = os.environ.get("CORS_ORIGINS", "*").split(",")
    API_VERSION: str = "v1"


settings = Settings()
