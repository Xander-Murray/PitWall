from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional
from app.schemas.request_models import AnalyzeTextRequest, VehicleContext
from app.schemas.response_models import AnalyzeResponse
from app.services.ai_client import analyze_quote, analyze_image_quote
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


ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}


@router.post("/analyze-image", response_model=AnalyzeResponse)
async def analyze_image(
    file: UploadFile = File(...),
    year: Optional[int] = Form(None),
    make: Optional[str] = Form(None),
    vehicle_model: Optional[str] = Form(None),
    mileage: Optional[int] = Form(None),
):
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported image type. Use JPEG, PNG, or WebP.")

    image_bytes = await file.read()

    vehicle = None
    if any([year, make, vehicle_model, mileage]):
        vehicle = VehicleContext(year=year, make=make, model=vehicle_model, mileage=mileage)

    try:
        result = analyze_image_quote(image_bytes, file.content_type, vehicle)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI analysis failed: {str(e)}")

    try:
        db = get_db()
        db.table("analyses").insert({
            "quote_text": "[IMAGE UPLOAD]",
            "vehicle_context": vehicle.model_dump() if vehicle else None,
            "result": result.model_dump(),
        }).execute()
    except Exception:
        pass

    return result
