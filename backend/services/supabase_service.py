import os
from supabase import create_client, Client
from typing import Dict, List, Optional
from uuid import UUID


class SupabaseService:
    """
    Service for interacting with Supabase database.
    Handles all CRUD operations for trades and ensures clean JSON responses.
    """
    
    def __init__(self):
        """Initialize Supabase client with environment variables"""
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_ANON_KEY")
        
        if not supabase_url or not supabase_key:
            raise ValueError("SUPABASE_URL and SUPABASE_ANON_KEY must be set in environment variables")
        
        self.supabase: Client = create_client(supabase_url, supabase_key)
        self.table_name = "trades"

    def insert_trade(self, data: Dict) -> Dict:
        """
        Insert a new trade into the database.
        
        Args:
            data: Dictionary containing trade data
            
        Returns:
            Dict: The inserted trade as a clean dictionary
            
        Raises:
            Exception: If insertion fails
        """
        try:
            # Serialize date/datetime objects to ISO format strings before insertion
            serialized_data = {}
            for key, value in data.items():
                if hasattr(value, "isoformat"):
                    serialized_data[key] = value.isoformat()
                else:
                    serialized_data[key] = value
            
            result = self.supabase.table(self.table_name).insert(serialized_data).execute()
            if result.data and len(result.data) > 0:
                # Return clean dict, not raw Supabase object
                return dict(result.data[0])
            raise Exception("Failed to insert trade: No data returned")
        except Exception as e:
            raise Exception(f"Supabase error inserting trade: {str(e)}")

    def get_all_trades(self) -> List[Dict]:
        """
        Get all trades from the database, ordered by date DESC.
        
        Returns:
            List[Dict]: List of trades as clean dictionaries
        """
        try:
            result = self.supabase.table(self.table_name).select("*").order("date", desc=True).execute()
            # Convert to clean dicts
            return [dict(trade) for trade in (result.data if result.data else [])]
        except Exception as e:
            raise Exception(f"Supabase error fetching trades: {str(e)}")

    def get_trade_by_id(self, trade_id: str) -> Optional[Dict]:
        """
        Get a single trade by ID.
        
        Args:
            trade_id: UUID string of the trade
            
        Returns:
            Optional[Dict]: Trade as a clean dictionary, or None if not found
        """
        try:
            result = self.supabase.table(self.table_name).select("*").eq("id", trade_id).execute()
            if result.data and len(result.data) > 0:
                # Return clean dict
                return dict(result.data[0])
            return None
        except Exception as e:
            raise Exception(f"Supabase error fetching trade: {str(e)}")

    def update_trade(self, trade_id: str, data: Dict) -> Optional[Dict]:
        """
        Update a trade by ID.
        
        Args:
            trade_id: UUID string of the trade
            data: Dictionary containing fields to update
            
        Returns:
            Optional[Dict]: Updated trade as a clean dictionary, or None if not found
        """
        try:
            # Serialize date/datetime objects to ISO format strings before update
            serialized_data = {}
            for key, value in data.items():
                if hasattr(value, "isoformat"):
                    serialized_data[key] = value.isoformat()
                else:
                    serialized_data[key] = value
            
            result = self.supabase.table(self.table_name).update(serialized_data).eq("id", trade_id).execute()
            if result.data and len(result.data) > 0:
                # Return clean dict
                return dict(result.data[0])
            return None
        except Exception as e:
            raise Exception(f"Supabase error updating trade: {str(e)}")

    def delete_trade(self, trade_id: str) -> bool:
        """
        Delete a trade by ID.
        
        Args:
            trade_id: UUID string of the trade
            
        Returns:
            bool: True if deletion was successful
        """
        try:
            result = self.supabase.table(self.table_name).delete().eq("id", trade_id).execute()
            # Supabase delete returns empty data array on success
            return True
        except Exception as e:
            raise Exception(f"Supabase error deleting trade: {str(e)}")

    def update_ai_feedback(self, trade_id: str, feedback: str) -> Optional[Dict]:
        """
        Update the AI feedback field for a trade.
        
        Args:
            trade_id: UUID string of the trade
            feedback: AI-generated feedback string
            
        Returns:
            Optional[Dict]: Updated trade as a clean dictionary, or None if not found
        """
        try:
            result = self.supabase.table(self.table_name).update({"ai_feedback": feedback}).eq("id", trade_id).execute()
            if result.data and len(result.data) > 0:
                # Return clean dict
                return dict(result.data[0])
            return None
        except Exception as e:
            raise Exception(f"Supabase error updating AI feedback: {str(e)}")
