from pydantic import BaseModel
from typing import Optional

class VehicleContext(BaseModel):
    year: Optional[int] = None
    make: Optional[str] = None
    model: Optional[str] = None
    mileage: Optional[int] = None

class AnalyzeTextRequest(BaseModel):
    quote_text: str
    vehicle: Optional[VehicleContext] = None
