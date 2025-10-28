from typing import List, Optional, Dict, Any
from datetime import datetime
from beanie import PydanticObjectId
from app.models import Item

# ... resto del código sin cambios

async def crear_item(item: Item) -> Item:
    await item.insert()
    return item

async def obtener_items_por_usuario(user_id: PydanticObjectId) -> List[Item]:
    return await Item.find(Item.owner.id == user_id).to_list()

async def obtener_item_por_id(item_id: PydanticObjectId) -> Optional[Item]:
    return await Item.get(item_id)

async def actualizar_item(item_id: PydanticObjectId, data: Dict[str, Any]) -> Optional[Item]:
    item = await Item.get(item_id)
    if not item:
        return None
    data.pop("id", None)
    data.pop("created_at", None)
    for k, v in data.items():
        setattr(item, k, v)
    await item.save()
    return item

async def eliminar_item(item_id: PydanticObjectId) -> bool:
    item = await Item.get(item_id)
    if not item:
        return False
    await item.delete()
    return True

# Opcionales
async def obtener_items_pendientes(user_id: PydanticObjectId) -> List[Item]:
    return await Item.find(Item.owner.id == user_id, Item.purchased == False).to_list()

async def marcar_item_comprado(item_id: PydanticObjectId, purchased: bool) -> Optional[Item]:
    item = await Item.get(item_id)
    if not item:
        return None
    item.purchased = purchased
    item.purchased_at = datetime.utcnow() if purchased else None
    await item.save()
    return item