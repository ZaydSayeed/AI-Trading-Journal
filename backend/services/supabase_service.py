import os
from supabase import create_client, Client
from typing import Dict, List, Optional
from uuid import UUID


class SupabaseService:
    def __init__(self):
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_ANON_KEY")
        
        if not supabase_url or not supabase_key:
            raise ValueError("SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment variables")
        
        self.supabase: Client = create_client(supabase_url, supabase_key)
        self.table_name = "trades"

    def insert_trade(self, data: Dict) -> Dict:
        """Insert a new trade into the database"""
        result = self.supabase.table(self.table_name).insert(data).execute()
        if result.data and len(result.data) > 0:
            return result.data[0]
        raise Exception("Failed to insert trade")

    def get_all_trades(self) -> List[Dict]:
        """Get all trades from the database"""
        result = self.supabase.table(self.table_name).select("*").order("date", desc=True).execute()
        return result.data if result.data else []

    def get_trade_by_id(self, trade_id: str) -> Optional[Dict]:
        """Get a single trade by ID"""
        result = self.supabase.table(self.table_name).select("*").eq("id", trade_id).execute()
        if result.data and len(result.data) > 0:
            return result.data[0]
        return None

    def update_trade(self, trade_id: str, data: Dict) -> Optional[Dict]:
        """Update a trade by ID"""
        result = self.supabase.table(self.table_name).update(data).eq("id", trade_id).execute()
        if result.data and len(result.data) > 0:
            return result.data[0]
        return None

    def delete_trade(self, trade_id: str) -> bool:
        """Delete a trade by ID"""
        result = self.supabase.table(self.table_name).delete().eq("id", trade_id).execute()
        return True

    def update_ai_feedback(self, trade_id: str, feedback: str) -> Optional[Dict]:
        """Update the AI feedback field for a trade"""
        result = self.supabase.table(self.table_name).update({"ai_feedback": feedback}).eq("id", trade_id).execute()
        if result.data and len(result.data) > 0:
            return result.data[0]
        return None

