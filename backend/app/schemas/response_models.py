from pydantic import BaseModel
from typing import List, Literal, Optional

Urgency = Literal["pit_now", "next_lap", "monitor", "unclear"]
Risk = Literal["low", "medium", "high"]

class RepairItem(BaseModel):
    name: str
    urgency: Urgency
    reason: str
    verify_flag: bool
    questions_to_ask: List[str]
    confidence: Risk
    price_range: Optional[str] = None  # e.g. "Typical: $150–$300"

class AnalyzeResponse(BaseModel):
    summary: str
    overall_risk: Risk
    race_status: Urgency
    repair_items: List[RepairItem]
    questions_for_the_garage: List[str]
    what_to_say_next: str
    confidence_notes: List[str]
    briefing_id: Optional[str] = None  # UUID assigned after Supabase insert
