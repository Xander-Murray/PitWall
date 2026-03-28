from fastapi import APIRouter, HTTPException
from app.database import get_db

router = APIRouter(prefix="/api", tags=["briefing"])


@router.get("/briefing/{briefing_id}")
async def get_briefing(briefing_id: str):
    try:
        db = get_db()
        res = db.table("analyses").select("*").eq("id", briefing_id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail="Database error.")

    if not res.data:
        raise HTTPException(status_code=404, detail="Briefing not found.")

    row = res.data[0]
    result = row["result"]
    # Re-attach the UUID so the frontend can show the share button on shared views
    result["briefing_id"] = briefing_id
    return {
        "result": result,
        "vehicle_context": row.get("vehicle_context"),
    }
