# routes/items.py
from app.core.auth import get_current_user
from app.models import Item, ShoppingList, User  # AÑADE ShoppingList aquí
from app.repository.items_repository import (
    actualizar_item,
    eliminar_item,
    marcar_item_comprado,
)
from app.schemas import ItemCreate, ItemPurchase, ItemResponse, ItemUpdate
from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, Response, status

router = APIRouter(prefix="/items", tags=["Items"])


@router.get("/", response_model=list[ItemResponse])
async def get_all_items(current_user: User = Depends(get_current_user)):
    """Obtener todos los ítems del usuario autenticado"""
    items = await Item.find(Item.user_id == current_user.id).to_list()
    return [
        ItemResponse.model_validate(item, from_attributes=True) for item in items
    ]


@router.get("/list/{list_id}", response_model=list[ItemResponse])
async def get_items_by_list(
    list_id: PydanticObjectId, current_user: User = Depends(get_current_user)
):
    """Obtener ítems por lista, validando propiedad de la lista"""
    list_obj = await ShoppingList.find_one(
        ShoppingList.id == list_id, ShoppingList.user_id == current_user.id
    )
    if not list_obj:
        raise HTTPException(status_code=404, detail="Lista no encontrada")

    items = await Item.find(
        Item.list_id == list_id, Item.user_id == current_user.id
    ).to_list()
    return [
        ItemResponse.model_validate(item, from_attributes=True) for item in items
    ]


@router.post("/", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
async def create_item(payload: ItemCreate, current_user: User = Depends(get_current_user)):
    """Crear un nuevo ítem en una lista (si se especifica)"""
    if payload.list_id:
        list_obj = await ShoppingList.find_one(
            ShoppingList.id == payload.list_id, ShoppingList.user_id == current_user.id
        )
        if not list_obj:
            raise HTTPException(status_code=404, detail="Lista no encontrada")

    item = Item(
        name=payload.name,
        quantity=payload.quantity,
        user_id=current_user.id,
        list_id=payload.list_id,
    )
    await item.insert()
    return ItemResponse.model_validate(item, from_attributes=True)


@router.put("/{item_id}", response_model=ItemResponse)
async def update_item(
    item_id: PydanticObjectId,
    update: ItemUpdate,
    current_user: User = Depends(get_current_user),
):
    """Actualizar un ítem existente"""
    item = await Item.get(item_id)
    if not item or item.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Item no encontrado")

    data = update.model_dump(exclude_unset=True)
    updated = await actualizar_item(item_id, data)
    return ItemResponse.model_validate(updated, from_attributes=True)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(item_id: PydanticObjectId, current_user: User = Depends(get_current_user)):
    """Eliminar un ítem si pertenece al usuario"""
    item = await Item.get(item_id)
    if not item or item.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Item no encontrado")

    await eliminar_item(item_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.patch("/{item_id}/purchase", response_model=ItemResponse)
async def mark_purchased(
    item_id: PydanticObjectId, body: ItemPurchase, current_user: User = Depends(get_current_user)
):
    """Marcar un ítem como comprado/no comprado"""
    item = await Item.get(item_id)
    if not item or item.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Item no encontrado")

    updated = await marcar_item_comprado(item_id, body.purchased)
    return ItemResponse.model_validate(updated, from_attributes=True)
