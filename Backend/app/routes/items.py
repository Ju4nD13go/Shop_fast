from fastapi import APIRouter, HTTPException, status, Response, Depends
from beanie import PydanticObjectId
from app.models import Item, User
from app.schemas import ItemCreate, ItemResponse, ItemUpdate, ItemPurchase
from app.repository.items_repository import (
    crear_item,
    actualizar_item,
    eliminar_item,
    marcar_item_comprado
)
from app.core.auth import get_current_user

router = APIRouter(prefix="/items", tags=["Items"])

# Obtener todos los items del usuario autenticado
@router.get("/", response_model=list[ItemResponse])
async def get_all_items(current_user: User = Depends(get_current_user)):
    items = await Item.find(Item.user_id == current_user.id).to_list()
    return [ItemResponse.model_validate(item, from_attributes=True) for item in items]

# Crear un nuevo ítem
@router.post("/", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
async def create_item(payload: ItemCreate, current_user: User = Depends(get_current_user)):
    item = Item(
        name=payload.name, 
        quantity=payload.quantity,
        user_id=current_user.id
    )
    creado = await crear_item(item)
    return ItemResponse.model_validate(creado, from_attributes=True)

# Actualizar un ítem
@router.put("/{item_id}", response_model=ItemResponse)
async def update_item(
    item_id: PydanticObjectId, 
    update: ItemUpdate,
    current_user: User = Depends(get_current_user)
):
    # Verificar que el item pertenece al usuario
    item = await Item.get(item_id)
    if not item or item.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Item no encontrado")
    
    data = update.model_dump(exclude_unset=True)
    updated = await actualizar_item(item_id, data)
    return ItemResponse.model_validate(updated, from_attributes=True)

# Eliminar ítem
@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(
    item_id: PydanticObjectId,
    current_user: User = Depends(get_current_user)
):
    # Verificar que el item pertenece al usuario
    item = await Item.get(item_id)
    if not item or item.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Item no encontrado")
    
    ok = await eliminar_item(item_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# Marcar ítem como comprado
@router.patch("/{item_id}/purchase", response_model=ItemResponse)
async def mark_purchased(
    item_id: PydanticObjectId, 
    body: ItemPurchase,
    current_user: User = Depends(get_current_user)
):
    # Verificar que el item pertenece al usuario
    item = await Item.get(item_id)
    if not item or item.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Item no encontrado")
    
    updated = await marcar_item_comprado(item_id, body.purchased)
    return ItemResponse.model_validate(updated, from_attributes=True)