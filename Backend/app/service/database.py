from app.core.config import settings
from app.models import Item, ShoppingList, Stats, User
from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

_client: AsyncIOMotorClient | None = None


async def init_db():
    global _client
    try:
        if _client is None:
            print(f"Conectando a MongoDB Atlas:")
            _client = AsyncIOMotorClient(settings.MONGO_URI)
        db = _client[settings.DB_NAME]
        await init_beanie(
            database=db, document_models=[User, Item, Stats, ShoppingList]
        )
        print(f" Beanie inicializado con la base de datos: {settings.DB_NAME}")
    except Exception as e:
        print(f" Error al conectar a la base de datos: {e}")
        raise

    # estoy realizando cambios para ver si se arregla el error.
