import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db

router = APIRouter(prefix="/api", tags=["outcomes"])
logger = logging.getLogger(__name__)


class OutcomeItem(BaseModel):
    repair_name: str
    approved: bool
    quoted_price: Optional[float] = None
    actual_price_paid: Optional[float] = None


class SubmitOutcomesRequest(BaseModel):
    briefing_id: Optional[str] = None
    vehicle_year: Optional[int] = None
    vehicle_make: Optional[str] = None
    vehicle_model: Optional[str] = None
    items: List[OutcomeItem]


@router.post("/outcomes")
async def submit_outcomes(request: SubmitOutcomesRequest):
    if not request.items:
        raise HTTPException(status_code=400, detail="No items provided.")
    rows = [
        {
            "repair_name": item.repair_name.lower().strip(),
            "briefing_id": request.briefing_id,
            "vehicle_year": request.vehicle_year,
            "vehicle_make": request.vehicle_make,
            "vehicle_model": request.vehicle_model,
            "quoted_price": item.quoted_price,
            "actual_price_paid": item.actual_price_paid if item.approved else None,
            "approved": item.approved,
        }
        for item in request.items
    ]
    try:
        db = get_db()
        db.table("repair_outcomes").insert(rows).execute()
    except Exception as e:
        logger.error("Failed to save outcomes: %s", e)
        raise HTTPException(status_code=500, detail="Failed to save outcomes.")
    return {"saved": len(rows)}


@router.get("/community-stats")
async def get_community_stats(repairs: str):
    names = [r.lower().strip() for r in repairs.split(",") if r.strip()]
    if not names:
        raise HTTPException(status_code=400, detail="No repair names provided.")
    try:
        db = get_db()
        res = (
            db.table("repair_outcomes")
            .select("repair_name,approved,actual_price_paid")
            .in_("repair_name", names)
            .execute()
        )
    except Exception as e:
        logger.error("Failed to fetch community stats: %s", e)
        raise HTTPException(status_code=500, detail="Failed to fetch community stats.")

    stats: dict = {}
    for row in res.data:
        name = row["repair_name"]
        if name not in stats:
            stats[name] = {"approved": 0, "total": 0, "prices": []}
        stats[name]["total"] += 1
        if row["approved"]:
            stats[name]["approved"] += 1
        if row["actual_price_paid"] is not None:
            stats[name]["prices"].append(float(row["actual_price_paid"]))

    result = {}
    for name, s in stats.items():
        avg = round(sum(s["prices"]) / len(s["prices"])) if s["prices"] else None
        result[name] = {"approved": s["approved"], "total": s["total"], "avg_paid": avg}
    return result
