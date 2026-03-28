import os
import json
import base64
from typing import Optional
from groq import Groq
from dotenv import load_dotenv
from app.schemas.request_models import AnalyzeTextRequest, VehicleContext
from app.schemas.response_models import AnalyzeResponse
from app.services.prompt_builder import SYSTEM_PROMPT, build_user_prompt, build_image_user_prompt

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


ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_IMAGE_BYTES = 10 * 1024 * 1024  # 10 MB


def analyze_image_quote(image_bytes: bytes, mime_type: str, vehicle: Optional[VehicleContext]) -> AnalyzeResponse:
    if mime_type not in ALLOWED_MIME_TYPES:
        raise ValueError(f"Unsupported image type: {mime_type}. Use JPEG, PNG, or WebP.")
    if len(image_bytes) > MAX_IMAGE_BYTES:
        raise ValueError("Image too large. Maximum size is 10 MB.")

    b64 = base64.b64encode(image_bytes).decode("utf-8")
    user_prompt = build_image_user_prompt(vehicle)

    response = _client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": f"data:{mime_type};base64,{b64}"}},
                    {"type": "text", "text": user_prompt},
                ],
            },
        ],
        temperature=0.2,
        max_tokens=2048,
    )

    text = response.choices[0].message.content

    try:
        data = json.loads(text)
        return AnalyzeResponse(**data)
    except Exception:
        # One retry with stronger JSON-only instruction
        retry_prompt = user_prompt + "\n\nIMPORTANT: Return only valid JSON matching the schema. No other text."
        response = _client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": [
                        {"type": "image_url", "image_url": {"url": f"data:{mime_type};base64,{b64}"}},
                        {"type": "text", "text": retry_prompt},
                    ],
                },
            ],
            temperature=0.2,
            max_tokens=2048,
        )
        data = json.loads(response.choices[0].message.content)
        return AnalyzeResponse(**data)
