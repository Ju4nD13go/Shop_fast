from datetime import datetime
from app.models import User, Item, ShoppingList

# ... resto del código sin cambios


async def obtener_total_usuarios() -> int:
    return await User.find_all().count()


async def obtener_total_items() -> int:
    return await Item.find_all().count()


async def obtener_total_listas() -> int:
    return await ShoppingList.find_all().count()


async def obtener_items_comprados() -> int:
    return await Item.find(Item.purchased == True).count()


async def obtener_items_pendientes() -> int:
    return await Item.find(Item.purchased == False).count()


async def snapshot_stats() -> dict:
    return {
        "total_users": await obtener_total_usuarios(),
        "total_items": await obtener_total_items(),
        "total_shopping_lists": await obtener_total_listas(),
        "items_purchased": await obtener_items_comprados(),
        "items_pending": await obtener_items_pendientes(),
        "created_at": datetime.utcnow(),
    }