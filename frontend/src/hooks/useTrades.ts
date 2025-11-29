import { useState, useEffect } from "react";
import { getTrades, createTrade, updateTrade, deleteTrade, Trade, TradeCreate, TradeUpdate } from "@/api/trades";
import { useToast } from "@/hooks/use-toast";

export type { Trade } from "@/api/trades";

export function useTrades() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTrades = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTrades();
      setTrades(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch trades";
      setError(message);
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const addTrade = async (trade: TradeCreate) => {
    try {
      const newTrade = await createTrade(trade);
      setTrades((prev) => [newTrade, ...prev]);
      toast({
        variant: "success",
        title: "Success",
        description: "Trade added successfully!",
      });
      return newTrade;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add trade";
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
      throw err;
    }
  };

  const editTrade = async (id: string, trade: TradeUpdate) => {
    try {
      const updatedTrade = await updateTrade(id, trade);
      setTrades((prev) => prev.map((t) => (t.id === id ? updatedTrade : t)));
      toast({
        variant: "success",
        title: "Success",
        description: "Trade updated successfully!",
      });
      return updatedTrade;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update trade";
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
      throw err;
    }
  };

  const removeTrade = async (id: string) => {
    try {
      await deleteTrade(id);
      setTrades((prev) => prev.filter((t) => t.id !== id));
      toast({
        variant: "success",
        title: "Success",
        description: "Trade deleted successfully!",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete trade";
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  return {
    trades,
    loading,
    error,
    fetchTrades,
    addTrade,
    editTrade,
    removeTrade,
  };
}

