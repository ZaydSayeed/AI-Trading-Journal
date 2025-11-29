from fastapi import APIRouter, HTTPException
from typing import List
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent.parent))

from models.trade_model import TradeCreate, TradeUpdate, TradeResponse
from services.supabase_service import SupabaseService
from services.ai_service import AIService
from uuid import UUID
import os

router = APIRouter(prefix="/trades", tags=["trades"])

supabase_service = SupabaseService()
ai_service = AIService()


@router.post("", response_model=TradeResponse, status_code=201)
async def create_trade(trade: TradeCreate):
    """Create a new trade and automatically generate AI feedback"""
    try:
        # Convert Pydantic model to dict
        trade_data = trade.model_dump(exclude_none=True)
        
        # Insert trade into database
        created_trade = supabase_service.insert_trade(trade_data)
        
        # Generate AI feedback asynchronously
        try:
            ai_feedback = ai_service.analyze_trade(created_trade)
            # Update trade with AI feedback
            supabase_service.update_ai_feedback(created_trade["id"], ai_feedback)
            created_trade["ai_feedback"] = ai_feedback
        except Exception as e:
            print(f"Error generating AI feedback: {str(e)}")
            # Continue even if AI fails
        
        return TradeResponse(**created_trade)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating trade: {str(e)}")


@router.get("", response_model=List[TradeResponse])
async def get_trades():
    """Get all trades"""
    try:
        trades = supabase_service.get_all_trades()
        return [TradeResponse(**trade) for trade in trades]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching trades: {str(e)}")


@router.get("/{trade_id}", response_model=TradeResponse)
async def get_trade(trade_id: str):
    """Get a single trade by ID"""
    try:
        trade = supabase_service.get_trade_by_id(trade_id)
        if not trade:
            raise HTTPException(status_code=404, detail="Trade not found")
        return TradeResponse(**trade)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching trade: {str(e)}")


@router.put("/{trade_id}", response_model=TradeResponse)
async def update_trade(trade_id: str, trade_update: TradeUpdate):
    """Update a trade"""
    try:
        # Check if trade exists
        existing_trade = supabase_service.get_trade_by_id(trade_id)
        if not existing_trade:
            raise HTTPException(status_code=404, detail="Trade not found")
        
        # Convert Pydantic model to dict, excluding None values
        update_data = trade_update.model_dump(exclude_none=True)
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        # Update trade
        updated_trade = supabase_service.update_trade(trade_id, update_data)
        
        if not updated_trade:
            raise HTTPException(status_code=500, detail="Failed to update trade")
        
        # Regenerate AI feedback if trade data changed
        try:
            ai_feedback = ai_service.analyze_trade(updated_trade)
            supabase_service.update_ai_feedback(trade_id, ai_feedback)
            updated_trade["ai_feedback"] = ai_feedback
        except Exception as e:
            print(f"Error regenerating AI feedback: {str(e)}")
        
        return TradeResponse(**updated_trade)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating trade: {str(e)}")


@router.delete("/{trade_id}", status_code=204)
async def delete_trade(trade_id: str):
    """Delete a trade"""
    try:
        # Check if trade exists
        existing_trade = supabase_service.get_trade_by_id(trade_id)
        if not existing_trade:
            raise HTTPException(status_code=404, detail="Trade not found")
        
        supabase_service.delete_trade(trade_id)
        return None
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting trade: {str(e)}")

