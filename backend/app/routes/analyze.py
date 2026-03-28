from fastapi import APIRouter, HTTPException
from app.schemas.request_models import AnalyzeTextRequest
from app.schemas.response_models import AnalyzeResponse
from app.services.ai_client import analyze_quote
from app.database import get_db

router = APIRouter(prefix="/api", tags=["analyze"])


@router.post("/analyze-text", response_model=AnalyzeResponse)
async def analyze_text(request: AnalyzeTextRequest):
    if not request.quote_text or len(request.quote_text.strip()) < 20:
        raise HTTPException(status_code=400, detail="Quote text too short.")

    try:
        result = analyze_quote(request)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI analysis failed: {str(e)}")

    # Store in Supabase (fire and forget -- don't fail the request if this fails)
    try:
        db = get_db()
        db.table("analyses").insert({
            "quote_text": request.quote_text,
            "vehicle_context": request.vehicle.model_dump() if request.vehicle else None,
            "result": result.model_dump(),
        }).execute()
    except Exception:
        pass

    return result


@router.post("/analyze-image")
async def analyze_image():
    raise HTTPException(status_code=501, detail="Image analysis not yet implemented.")
