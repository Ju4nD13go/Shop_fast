from datetime import datetime

from app.core.auth import get_current_user
from app.models import Item, User
from app.schemas import StatsResponse
from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(prefix="/stats", tags=["Stats"])


@router.get("/", response_model=StatsResponse)
async def get_stats(current_user: User = Depends(get_current_user)):
    """
    Retorna estadísticas del usuario autenticado.
    """
    try:
        total_items = await Item.find(Item.user_id == current_user.id).count()
        items_purchased = await Item.find(Item.user_id == current_user.id, Item.purchased == True).count()  # noqa: E712
        items_pending = await Item.find(Item.user_id == current_user.id, Item.purchased == False).count()  # noqa: E712

        data = {
            "total_users": 1,  # Solo el usuario actual
            "total_items": total_items,
            "total_shopping_lists": 0,  # Puedes implementar esto después
            "items_purchased": items_purchased,
            "items_pending": items_pending,
            "created_at": datetime.utcnow(),
        }
        return StatsResponse.model_validate(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener estadísticas: {e}")
