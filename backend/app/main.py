from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import analyze, demo, stats, briefing, outcomes

app = FastAPI(title="PitWall API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router)
app.include_router(demo.router)
app.include_router(stats.router)
app.include_router(briefing.router)
app.include_router(outcomes.router)


@app.get("/")
def health():
    return {"status": "ok", "service": "pitwall"}
