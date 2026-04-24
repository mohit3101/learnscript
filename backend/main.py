from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import Response
from pydantic import BaseModel
from services.youtube import get_transcript
from services.chunker import chunk_transcript
from services.rate_limiter import is_rate_limited, remaining_requests
from services.ai import generate_all

app = FastAPI(title="LearnScript API", version="1.0.0")

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "600",
}

@app.middleware("http")
async def cors_middleware(request: Request, call_next):
    if request.method == "OPTIONS":
        return Response(status_code=200, headers=CORS_HEADERS)
    response = await call_next(request)
    for key, value in CORS_HEADERS.items():
        response.headers[key] = value
    return response

MAX_DURATION_SECONDS = 1800


class VideoRequest(BaseModel):
    url: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/generate")
async def generate(request: Request, body: VideoRequest):
    ip = request.client.host

    if is_rate_limited(ip):
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Max 5 requests per hour.",
        )

    try:
        data = get_transcript(body.url)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    if data["duration"] > MAX_DURATION_SECONDS:
        raise HTTPException(
            status_code=400,
            detail=f"Video too long ({data['duration'] // 60} min). Max is 30 minutes.",
        )

    try:
        content = await generate_all(data["transcript"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

    return {
        "success": True,
        "video_id": data["video_id"],
        "duration": data["duration"],
        "content": content,
    }
