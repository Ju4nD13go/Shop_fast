from app.models import Item, ShoppingList
from app.repository.shopping_list_repository import \
    actualizar_lista as actualizar_lista_repo
from app.repository.shopping_list_repository import \
    eliminar_lista as eliminar_lista_repo
from app.repository.shopping_list_repository import (obtener_lista_por_id,
                                                     obtener_todas_las_listas)
from app.schemas import ListCreate, ListResponse, ListUpdate
from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException, Response, status

router = APIRouter(prefix="/lists", tags=["Lists"])

# ... resto del código sin cambios


def _cast_and_validate_ids(ids: list[str] | None) -> list[PydanticObjectId]:
    cast: list[PydanticObjectId] = []
    for s in ids or []:
        try:
            oid = PydanticObjectId(s)
        except Exception:
            continue
        # valida existencia de Item (opcional)
        # elimina esta verificación si no la quieres
        # if not await Item.get(oid): continue
        cast.append(oid)
    return cast


@router.post("/", response_model=ListResponse, status_code=status.HTTP_201_CREATED)
async def crear_lista(body: ListCreate):
    cast_ids = _cast_and_validate_ids(body.item_ids)
    doc = ShoppingList(name=body.name, items=cast_ids)
    await doc.insert()
    return ListResponse.model_validate(doc, from_attributes=True)


@router.get("/", response_model=list[ListResponse])
async def listar_listas():
    lists = await obtener_todas_las_listas()
    return [ListResponse.model_validate(x, from_attributes=True) for x in lists]


@router.get("/{list_id}", response_model=ListResponse)
async def obtener_lista(list_id: PydanticObjectId):
    sl = await obtener_lista_por_id(list_id)
    if not sl:
        raise HTTPException(status_code=404, detail="Lista no encontrada")
    return ListResponse.model_validate(sl, from_attributes=True)


@router.put("/{list_id}", response_model=ListResponse)
async def actualizar_lista_endpoint(list_id: PydanticObjectId, update: ListUpdate):
    data = update.model_dump(exclude_unset=True)
    if "item_ids" in data:
        data["items"] = _cast_and_validate_ids(data["item_ids"])
        data.pop("item_ids", None)
    updated = await actualizar_lista_repo(list_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Lista no encontrada")
    return ListResponse.model_validate(updated, from_attributes=True)


@router.delete("/{list_id}", status_code=status.HTTP_204_NO_CONTENT)
async def eliminar_lista_endpoint(list_id: PydanticObjectId):
    ok = await eliminar_lista_repo(list_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Lista no encontrada")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
