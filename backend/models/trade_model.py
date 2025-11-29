from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import date, datetime
from uuid import UUID


class TradeCreate(BaseModel):
    user_id: Optional[UUID] = None
    ticker: str = Field(..., min_length=1, max_length=10)
    entry: float = Field(..., gt=0)
    exit: float = Field(..., gt=0)
    direction: Literal["long", "short"]
    setup: str = Field(..., min_length=1)
    notes: Optional[str] = None
    tags: Optional[List[str]] = []
    date: date


class TradeUpdate(BaseModel):
    ticker: Optional[str] = Field(None, min_length=1, max_length=10)
    entry: Optional[float] = Field(None, gt=0)
    exit: Optional[float] = Field(None, gt=0)
    direction: Optional[Literal["long", "short"]] = None
    setup: Optional[str] = Field(None, min_length=1)
    notes: Optional[str] = None
    tags: Optional[List[str]] = None
    date: Optional[date] = None


class TradeResponse(BaseModel):
    id: UUID
    user_id: Optional[UUID]
    ticker: str
    entry: float
    exit: float
    direction: str
    setup: str
    notes: Optional[str]
    tags: Optional[List[str]]
    date: date
    ai_feedback: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

