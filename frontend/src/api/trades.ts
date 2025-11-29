import { api } from "./client";

export interface Trade {
  id: string;
  ticker: string;
  entry: number;
  exit: number | null;
  direction: "long" | "short";
  setup: string | null;
  notes: string | null;
  tags: string[] | null;
  date: string;
  user_id: string | null;
  created_at: string;
  ai_feedback: string | null;
}

export interface TradeCreate {
  ticker: string;
  entry: number;
  exit?: number | null;
  direction: "long" | "short";
  setup?: string | null;
  notes?: string | null;
  tags?: string[] | null;
  date: string;
}

export interface TradeUpdate {
  ticker?: string;
  entry?: number;
  exit?: number | null;
  direction?: "long" | "short";
  setup?: string | null;
  notes?: string | null;
  tags?: string[] | null;
  date?: string;
}

export const getTrades = async (): Promise<Trade[]> => {
  const response = await api.get<Trade[]>("/trades");
  return response.data;
};

export const getTrade = async (id: string): Promise<Trade> => {
  const response = await api.get<Trade>(`/trades/${id}`);
  return response.data;
};

export const createTrade = async (trade: TradeCreate): Promise<Trade> => {
  const response = await api.post<Trade>("/trades", trade);
  return response.data;
};

export const updateTrade = async (id: string, trade: TradeUpdate): Promise<Trade> => {
  const response = await api.put<Trade>(`/trades/${id}`, trade);
  return response.data;
};

export const deleteTrade = async (id: string): Promise<void> => {
  await api.delete(`/trades/${id}`);
};

