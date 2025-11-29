from pydantic import BaseModel, Field, field_validator, ConfigDict
from typing import Optional, List
from datetime import date
from uuid import UUID


class TradeBase(BaseModel):
    ticker: str = Field(..., min_length=1, max_length=10)
    entry: float = Field(..., gt=0)
    exit: Optional[float] = Field(None, gt=0)
    direction: str = Field(..., description="'long' or 'short'")
    setup: Optional[str] = None
    notes: Optional[str] = None
    tags: Optional[List[str]] = None
    date: date

    @field_validator('direction')
    @classmethod
    def validate_direction(cls, v):
        if v.lower() not in ["long", "short"]:
            raise ValueError("direction must be either 'long' or 'short'")
        return v.lower()


class TradeCreate(TradeBase):
    """User-provided fields only"""
    pass


class TradeUpdate(BaseModel):
    ticker: Optional[str] = None
    entry: Optional[float] = None
    exit: Optional[float] = None
    direction: Optional[str] = None
    setup: Optional[str] = None
    notes: Optional[str] = None
    tags: Optional[List[str]] = None
    date: Optional[date] = None

    @field_validator('direction')
    @classmethod
    def validate_direction(cls, v):
        if v and v.lower() not in ["long", "short"]:
            raise ValueError("direction must be either 'long' or 'short'")
        return v.lower() if v else v


class TradeResponse(TradeBase):
    id: UUID
    user_id: Optional[str]
    created_at: str
    ai_feedback: Optional[str]

    model_config = ConfigDict(from_attributes=True)
