from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List


# ─── Auth ───────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None


# ─── Chat ────────────────────────────────────────────────────────────────────

class Query(BaseModel):
    question: str

class AnswerResponse(BaseModel):
    answer: str
    retrieved_documents: List[str]

class HistoryItem(BaseModel):
    id: int
    question: str
    answer: str
    timestamp: datetime

    model_config = {"from_attributes": True}
