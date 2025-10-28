# backend/app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Mini Lista de Compras"
    DEBUG: bool = True
    host: str = "0.0.0.0"
    port: int = 8000

    # MongoDB (use .env to override in production)
    MONGO_URI: str = "mongodb+srv://shop_fast_db:zdTpxhxR5yTwFUnx@shop.z9he8ya.mongodb.net/shop_fast?retryWrites=true&w=majority&appName=Shop"
    DB_NAME: str = "shop_fast"

    # JWT
    SECRET_KEY: str = "cambiaesta"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # CORS (NUEVO)
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )


settings = Settings()
