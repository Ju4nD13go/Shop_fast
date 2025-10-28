from typing import Optional, Dict, Any
from beanie import PydanticObjectId
from app.models import ShoppingList

# ... resto del código sin cambios

# Crear una nueva lista de compras
async def crear_lista(shopping_list: ShoppingList) -> ShoppingList:
    await shopping_list.create()
    return shopping_list

# Obtener una lista de compras por ID
async def obtener_lista_por_id(list_id: PydanticObjectId) -> Optional[ShoppingList]:
    return await ShoppingList.get(list_id)

# Obtener todas las listas de compras
async def obtener_todas_las_listas() -> list[ShoppingList]:
    return await ShoppingList.find_all().to_list()

# Actualizar una lista de compras
async def actualizar_lista(list_id: PydanticObjectId, data: Dict[str, Any]) -> Optional[ShoppingList]:
    sl = await ShoppingList.get(list_id)
    if not sl:
        return None
    # Solo campos permitidos
    if "name" in data:
        sl.name = data["name"]
    if "items" in data and isinstance(data["items"], list):
        sl.items = data["items"]
    await sl.save()
    return sl

# Eliminar una lista de compras
async def eliminar_lista(list_id: PydanticObjectId) -> bool:
    sl = await ShoppingList.get(list_id)
    if not sl:
        return False
    await sl.delete()
    return True