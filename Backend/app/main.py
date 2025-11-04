from contextlib import asynccontextmanager

from app.core.config import settings
from app.routes import items, shopping_list, stats, user
from app.service.database import init_db
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Conectando a MongoDB...")
    await init_db()
    print("MongoDB conectado correctamente.")
    yield
    # Shutdown (agrega limpieza si es necesario)


app = FastAPI(title=settings.APP_NAME, redirect_slashes=False, lifespan=lifespan)

# ✅ CORS - Actualizado para incluir EC2 y Capacitor
app.add_middleware(
    CORSMiddleware,
    allow_origins=[*settings.CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "Mini Lista de Compras API",
        "status": "online",
        "version": "2.0.0",
    }


# Rutas
app.include_router(user.router)  # /auth/*
app.include_router(items.router)  # /items/*
app.include_router(stats.router)  # /stats/*
app.include_router(shopping_list.router)  # /lists/*
