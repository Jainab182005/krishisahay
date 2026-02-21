from contextlib import asynccontextmanager
from typing import List
import json
import os

import requests
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import get_db, init_db
from auth import router as auth_router, get_current_user
from rag import get_rag_engine
from models import User, ChatHistory
from schemas import Query, AnswerResponse, HistoryItem


# ─── Lifespan ────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialise DB tables + load RAG engine (FAISS index)
    init_db()
    get_rag_engine()  # warm up – loads model + builds index
    yield
    # Shutdown: nothing to clean up


# ─── App ─────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="KrishiSahay API",
    description="AI-powered agricultural assistant with RAG, auth, and multilingual support",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — liberal for dev, tighten origins in production
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount auth routes (/register, /token)
app.include_router(auth_router)


# ─── Health ──────────────────────────────────────────────────────────────────

@app.get("/", tags=["health"])
def health_check():
    return {"message": "KrishiSahay API running 🌾", "status": "ok"}


# ─── Weather ─────────────────────────────────────────────────────────────────

@app.get("/weather", tags=["weather"])
def get_weather(lat: float, lon: float):
    """Fetch current weather using Open-Meteo (no API key required)."""
    try:
        url = (
            f"https://api.open-meteo.com/v1/forecast"
            f"?latitude={lat}&longitude={lon}&current_weather=true"
        )
        resp = requests.get(url, timeout=8)
        resp.raise_for_status()
        data = resp.json()
        cw = data["current_weather"]
        return {
            "temperature": cw["temperature"],
            "windspeed": cw["windspeed"],
            "weathercode": cw.get("weathercode"),
        }
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Weather API error: {exc}")


# ─── Ask (Protected) ─────────────────────────────────────────────────────────

@app.post("/ask", response_model=AnswerResponse, tags=["ai"])
def ask_question(
    query: Query,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """RAG-powered Q&A. Requires Bearer token. Persists chat history."""
    rag = get_rag_engine()
    result = rag.ask(query.question)

    # Persist to DB
    history_entry = ChatHistory(
        user_id=current_user.id,
        question=query.question,
        answer=result["answer"],
        retrieved_docs=json.dumps(result["retrieved_documents"]),
    )
    db.add(history_entry)
    db.commit()

    return result


# ─── Chat History (Protected) ─────────────────────────────────────────────────

@app.get("/history", response_model=List[HistoryItem], tags=["ai"])
def get_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 20,
):
    """Return the authenticated user's last N chat history entries."""
    entries = (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == current_user.id)
        .order_by(ChatHistory.timestamp.desc())
        .limit(limit)
        .all()
    )
    return entries


# ─── Me ──────────────────────────────────────────────────────────────────────

@app.get("/me", tags=["auth"])
def get_me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "email": current_user.email}
