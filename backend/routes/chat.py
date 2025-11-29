from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent.parent))

from services.supabase_service import SupabaseService
from services.ai_service import AIService
from typing import Optional
from uuid import UUID

router = APIRouter(prefix="/chat", tags=["chat"])

supabase_service = SupabaseService()
ai_service = AIService()


class ChatRequest(BaseModel):
    message: str
    user_id: Optional[UUID] = None


class ChatResponse(BaseModel):
    response: str


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Chat with AI coach about trading history"""
    try:
        # Get all trades (optionally filter by user_id in the future)
        trades = supabase_service.get_all_trades()
        
        # Generate chat response using AI service
        response = ai_service.chat(request.message, trades)
        
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating chat response: {str(e)}")

