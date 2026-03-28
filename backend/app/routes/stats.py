from fastapi import APIRouter
from app.database import get_db

router = APIRouter(prefix="/api", tags=["stats"])


@router.get("/stats")
async def get_stats():
    try:
        db = get_db()
        response = db.table("analyses").select("id", count="exact").execute()
        return {"count": response.count or 0}
    except Exception:
        return {"count": 0}
