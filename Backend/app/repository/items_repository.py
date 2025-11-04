# repository/items_repository.py
from datetime import datetime
from typing import Any, Dict, List, Optional

from app.models import Item
from beanie import PydanticObjectId


async def crear_item(item: Item) -> Item:
    await item.insert()
    return item


async def obtener_items_por_usuario(user_id: PydanticObjectId) -> List[Item]:
    return await Item.find(Item.user_id == user_id).to_list()


async def obtener_items_por_lista(user_id: PydanticObjectId, list_id: PydanticObjectId) -> List[Item]:
    return await Item.find(Item.user_id == user_id, Item.list_id == list_id).to_list()


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


async def obtener_items_pendientes(user_id: PydanticObjectId, list_id: Optional[PydanticObjectId] = None) -> List[Item]:
    if list_id:
        # Beanie: mantener comparación explícita para query; desactivar E712 de ruff
        return await Item.find(
            Item.user_id == user_id,
            Item.list_id == list_id,
            Item.purchased == False,  # noqa: E712
        ).to_list()
    else:
        # Beanie: mantener comparación explícita para query; desactivar E712 de ruff
        return await Item.find(
            Item.user_id == user_id,
            Item.purchased == False,  # noqa: E712
        ).to_list()


async def marcar_item_comprado(item_id: PydanticObjectId, purchased: bool) -> Optional[Item]:
    item = await Item.get(item_id)
    if not item:
        return None
    item.purchased = purchased
    item.purchased_at = datetime.utcnow() if purchased else None
    await item.save()
    return item
