import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv
from app.schemas.request_models import AnalyzeTextRequest
from app.schemas.response_models import AnalyzeResponse
from app.services.prompt_builder import SYSTEM_PROMPT, build_user_prompt

load_dotenv()

_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

_config = types.GenerateContentConfig(
    system_instruction=SYSTEM_PROMPT,
    response_mime_type="application/json",
    temperature=0.2,
)


def analyze_quote(request: AnalyzeTextRequest) -> AnalyzeResponse:
    user_prompt = build_user_prompt(request)

    response = _client.models.generate_content(
        model="gemini-1.5-flash",
        contents=user_prompt,
        config=_config,
    )

    try:
        data = json.loads(response.text)
        return AnalyzeResponse(**data)
    except Exception:
        # One retry with stricter instruction
        retry_prompt = user_prompt + "\n\nIMPORTANT: Return only valid JSON matching the schema. No other text."
        response = _client.models.generate_content(
            model="gemini-1.5-flash",
            contents=retry_prompt,
            config=_config,
        )
        data = json.loads(response.text)
        return AnalyzeResponse(**data)
