const TOKEN_KEY = "user_token";

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);

export const clearSession = () => localStorage.removeItem(TOKEN_KEY);
