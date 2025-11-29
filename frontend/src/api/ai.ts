import { api } from "./client";

export interface AnalyzeRequest {
  trade_id: string;
}

export interface AnalyzeResponse {
  trade_id: string;
  analysis: string;
}

export const analyzeTrade = async (tradeId: string): Promise<string> => {
  const response = await api.post<AnalyzeResponse>("/ai/analyze", {
    trade_id: tradeId,
  });
  return response.data.analysis;
};

