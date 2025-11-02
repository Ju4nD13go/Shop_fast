# shopping_list.py
from app.core.auth import get_current_user
from app.models import ShoppingList, User
from app.schemas import ListCreate, ListResponse, ListUpdate
from beanie import PydanticObjectId
from fastapi import APIRouter, Depends, HTTPException, Response, status

router = APIRouter(prefix="/lists", tags=["Lists"])

def _cast_and_validate_ids(ids: list[str] | None) -> list[PydanticObjectId]:
    cast: list[PydanticObjectId] = []
    for s in ids or []:
        try:
            oid = PydanticObjectId(s)
        except Exception:
            continue
        cast.append(oid)
    return cast

@router.post("/", response_model=ListResponse, status_code=status.HTTP_201_CREATED)
async def crear_lista(
    body: ListCreate, 
    current_user: User = Depends(get_current_user)
):
    try:
        cast_ids = _cast_and_validate_ids(body.item_ids)
        doc = ShoppingList(
            name=body.name, 
            items=cast_ids,
            user_id=current_user.id
        )
        await doc.insert()
        return ListResponse.model_validate(doc, from_attributes=True)
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error al crear lista: {str(e)}"
        )

@router.get("/", response_model=list[ListResponse])
async def listar_listas(current_user: User = Depends(get_current_user)):
    try:
        # Filtra las listas por el usuario actual
        lists = await ShoppingList.find(ShoppingList.user_id == current_user.id).to_list()
        return [ListResponse.model_validate(x, from_attributes=True) for x in lists]
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error al obtener listas: {str(e)}"
        )

@router.get("/{list_id}", response_model=ListResponse)
async def obtener_lista(
    list_id: PydanticObjectId, 
    current_user: User = Depends(get_current_user)
):
    try:
        sl = await ShoppingList.find_one(
            ShoppingList.id == list_id, 
            ShoppingList.user_id == current_user.id
        )
        if not sl:
            raise HTTPException(status_code=404, detail="Lista no encontrada")
        return ListResponse.model_validate(sl, from_attributes=True)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error al obtener lista: {str(e)}"
        )

@router.put("/{list_id}", response_model=ListResponse)
async def actualizar_lista_endpoint(
    list_id: PydanticObjectId, 
    update: ListUpdate,
    current_user: User = Depends(get_current_user)
):
    try:
        # Verifica que la lista pertenezca al usuario
        existing_list = await ShoppingList.find_one(
            ShoppingList.id == list_id,
            ShoppingList.user_id == current_user.id
        )
        if not existing_list:
            raise HTTPException(status_code=404, detail="Lista no encontrada")
        
        data = update.model_dump(exclude_unset=True)
        if "item_ids" in data:
            data["items"] = _cast_and_validate_ids(data["item_ids"])
            data.pop("item_ids", None)
        
        # Actualizar la lista
        for key, value in data.items():
            setattr(existing_list, key, value)
        
        await existing_list.save()
        return ListResponse.model_validate(existing_list, from_attributes=True)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error al actualizar lista: {str(e)}"
        )

@router.delete("/{list_id}", status_code=status.HTTP_204_NO_CONTENT)
async def eliminar_lista_endpoint(
    list_id: PydanticObjectId,
    current_user: User = Depends(get_current_user)
):
    try:
        # Verifica que la lista pertenezca al usuario
        existing_list = await ShoppingList.find_one(
            ShoppingList.id == list_id,
            ShoppingList.user_id == current_user.id
        )
        if not existing_list:
            raise HTTPException(status_code=404, detail="Lista no encontrada")
        
        await existing_list.delete()
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error al eliminar lista: {str(e)}"
        )