from fastapi import APIRouter, HTTPException
from app.database import get_db

router = APIRouter(prefix="/api", tags=["demo"])


@router.get("/demo-scenarios")
async def get_demo_scenarios():
    try:
        db = get_db()
        response = db.table("demo_scenarios").select("*").order("created_at").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load demo scenarios: {str(e)}")
