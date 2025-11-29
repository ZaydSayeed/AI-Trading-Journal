import { api } from "./client";

export interface ThemeResponse {
  theme: "dark" | "light";
}

export interface ThemeRequest {
  theme: "dark" | "light";
}

export const getTheme = async (): Promise<"dark" | "light"> => {
  const response = await api.get<ThemeResponse>("/settings/theme");
  return response.data.theme;
};

export const setTheme = async (theme: "dark" | "light"): Promise<"dark" | "light"> => {
  const response = await api.post<ThemeResponse>("/settings/theme", { theme });
  return response.data.theme;
};

