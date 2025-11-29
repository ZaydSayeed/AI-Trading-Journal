from fastapi import APIRouter, HTTPException
from typing import Dict

from services.supabase_service import SupabaseService
from services.ai_service import AIService
from models.trade_model import TradeResponse

router = APIRouter(prefix="/ai", tags=["ai"])

supabase_service = SupabaseService()
ai_service = AIService()


@router.post("/analyze")
async def analyze_trade(request: Dict):
    """Analyze a single trade"""
    try:
        trade_id = request.get("trade_id")
        if not trade_id:
            raise HTTPException(status_code=400, detail="trade_id is required")
        
        trade = supabase_service.get_trade_by_id(trade_id)
        if not trade:
            raise HTTPException(status_code=404, detail="Trade not found")
        
        analysis = ai_service.analyze_trade(trade)
        
        # Update the trade with the new analysis
        supabase_service.update_ai_feedback(trade_id, analysis)
        
        return {
            "trade_id": trade_id,
            "analysis": analysis
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing trade: {str(e)}")


@router.get("/insights")
async def get_insights():
    """Get comprehensive insights from all trades"""
    try:
        trades = supabase_service.get_all_trades()
        insights = ai_service.analyze_full_history(trades)
        
        return {
            "total_trades": len(trades),
            "insights": insights
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating insights: {str(e)}")
