import os
import json
from groq import Groq
from dotenv import load_dotenv
from app.schemas.request_models import AnalyzeTextRequest
from app.schemas.response_models import AnalyzeResponse
from app.services.prompt_builder import SYSTEM_PROMPT, build_user_prompt

load_dotenv()

_client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def analyze_quote(request: AnalyzeTextRequest) -> AnalyzeResponse:
    user_prompt = build_user_prompt(request)

    response = _client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        response_format={"type": "json_object"},
        temperature=0.2,
        max_tokens=2048,
    )

    text = response.choices[0].message.content

    try:
        data = json.loads(text)
        return AnalyzeResponse(**data)
    except Exception:
        # One retry with stricter instruction
        retry_prompt = user_prompt + "\n\nIMPORTANT: Return only valid JSON matching the schema. No other text."
        response = _client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": retry_prompt},
            ],
            response_format={"type": "json_object"},
            temperature=0.2,
            max_tokens=2048,
        )
        data = json.loads(response.choices[0].message.content)
        return AnalyzeResponse(**data)
