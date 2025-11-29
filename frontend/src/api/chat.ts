import { api } from "./client";

export interface ChatMessage {
  message: string;
  user_id?: string | null;
}

export interface ChatResponse {
  response: string;
}

export const sendMessage = async (message: string): Promise<string> => {
  const response = await api.post<ChatResponse>("/chat", {
    message,
  });
  return response.data.response;
};

