from fastapi import APIRouter, HTTPException
from typing import List

from models.trade_model import TradeCreate, TradeUpdate, TradeResponse
from services.supabase_service import SupabaseService
from services.ai_service import AIService

router = APIRouter(prefix="/trades", tags=["trades"])

# Initialize services (using dependency injection pattern)
# In production, consider using FastAPI's Depends for better testability
supabase_service = SupabaseService()
ai_service = AIService()


def _create_clean_trade_dict(trade: dict) -> dict:
    """
    Create a clean dictionary for AI analysis, containing only relevant trade fields.
    This ensures AI service receives clean data without database metadata.
    
    Args:
        trade: Dictionary containing trade data from Supabase
        
    Returns:
        dict: Clean dictionary with only trade fields needed for AI analysis
    """
    return {
        "ticker": trade.get("ticker"),
        "entry": trade.get("entry"),
        "exit": trade.get("exit"),
        "direction": trade.get("direction"),
        "setup": trade.get("setup"),
        "notes": trade.get("notes"),
        "tags": trade.get("tags") or [],
        "date": trade.get("date"),
    }


@router.post("", response_model=TradeResponse, status_code=201)
async def create_trade(trade: TradeCreate):
    """
    Create a new trade and automatically generate AI feedback.
    
    - Inserts trade into Supabase
    - Automatically calls AI service to analyze the trade
    - Saves AI feedback back to the database
    """
    try:
        # Convert Pydantic model to dict, excluding None values
        trade_data = trade.model_dump(exclude_none=True)
        
        # Insert trade into database
        created_trade = supabase_service.insert_trade(trade_data)
        
        # Generate AI feedback automatically after trade creation
        try:
            # Create clean dict for AI analysis (excludes database metadata)
            clean_trade_for_ai = _create_clean_trade_dict(created_trade)
            ai_feedback = ai_service.analyze_trade(clean_trade_for_ai)
            
            # Update trade with AI feedback in Supabase
            supabase_service.update_ai_feedback(created_trade["id"], ai_feedback)
            # Update local dict for response
            created_trade["ai_feedback"] = ai_feedback
        except Exception as e:
            # Log error but don't fail the request if AI analysis fails
            print(f"Warning: Error generating AI feedback: {str(e)}")
            # Continue without AI feedback
        
        return TradeResponse(**created_trade)
        
    except ValueError as e:
        # Validation errors from Pydantic
        raise HTTPException(status_code=400, detail=f"Validation error: {str(e)}")
    except Exception as e:
        # Supabase or other errors
        raise HTTPException(status_code=500, detail=f"Error creating trade: {str(e)}")


@router.get("", response_model=List[TradeResponse])
async def get_trades():
    """
    Get all trades ordered by date DESC.
    
    Returns a list of all trades in the database, sorted by date (newest first).
    """
    try:
        trades = supabase_service.get_all_trades()
        # Convert to Pydantic models for validation and serialization
        return [TradeResponse(**trade) for trade in trades]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching trades: {str(e)}")


@router.get("/{id}", response_model=TradeResponse)
async def get_trade(id: str):
    """
    Get a single trade by ID.
    
    - Returns 404 if trade not found
    - Returns 500 if database error occurs
    """
    try:
        trade = supabase_service.get_trade_by_id(id)
        if not trade:
            raise HTTPException(status_code=404, detail="Trade not found")
        return TradeResponse(**trade)
    except HTTPException:
        # Re-raise HTTP exceptions (like 404)
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching trade: {str(e)}")


@router.put("/{id}", response_model=TradeResponse)
async def update_trade(id: str, trade_update: TradeUpdate):
    """
    Update an existing trade.
    
    - Only updates fields provided in the request
    - Automatically regenerates AI feedback after update
    - Returns 404 if trade not found
    - Returns 500 if update fails
    """
    try:
        # Check if trade exists
        existing_trade = supabase_service.get_trade_by_id(id)
        if not existing_trade:
            raise HTTPException(status_code=404, detail="Trade not found")
        
        # Convert Pydantic model to dict, excluding None values
        update_data = trade_update.model_dump(exclude_none=True)
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        # Update trade in database (Supabase merge happens automatically)
        updated_trade = supabase_service.update_trade(id, update_data)
        
        if not updated_trade:
            raise HTTPException(status_code=500, detail="Failed to update trade")
        
        # Regenerate AI feedback if trade data changed
        try:
            # Create clean dict for AI analysis (excludes database metadata)
            clean_trade_for_ai = _create_clean_trade_dict(updated_trade)
            ai_feedback = ai_service.analyze_trade(clean_trade_for_ai)
            
            supabase_service.update_ai_feedback(id, ai_feedback)
            # Update local dict for response
            updated_trade["ai_feedback"] = ai_feedback
        except Exception as e:
            # Log error but don't fail the request if AI analysis fails
            print(f"Warning: Error regenerating AI feedback: {str(e)}")
            # Continue without updated AI feedback
        
        return TradeResponse(**updated_trade)
        
    except HTTPException:
        # Re-raise HTTP exceptions (like 404, 400)
        raise
    except ValueError as e:
        # Validation errors
        raise HTTPException(status_code=400, detail=f"Validation error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating trade: {str(e)}")


@router.delete("/{id}", status_code=204)
async def delete_trade(id: str):
    """
    Delete a trade by ID.
    
    - Returns 204 No Content on success
    - Returns 404 if trade not found
    - Returns 500 if deletion fails
    """
    try:
        # Check if trade exists
        existing_trade = supabase_service.get_trade_by_id(id)
        if not existing_trade:
            raise HTTPException(status_code=404, detail="Trade not found")
        
        # Delete trade from database
        supabase_service.delete_trade(id)
        
        # Return 204 No Content (FastAPI handles this automatically)
        return None
        
    except HTTPException:
        # Re-raise HTTP exceptions (like 404)
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting trade: {str(e)}")
