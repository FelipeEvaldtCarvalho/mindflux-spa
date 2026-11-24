import { isAxiosError } from "axios";

// Mensagem legível para mostrar ao usuário: usa a mensagem da API quando houver
// (ex.: "Já existe um cliente com este CPF") e trata falta de conexão.
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError(error)) {
    if (!error.response) {
      return "Sem conexão com o servidor. Verifique a internet e tente novamente.";
    }
    const message = error.response.data?.message;
    if (error.response.status < 500 && message) {
      return Array.isArray(message) ? message.join(". ") : String(message);
    }
  }
  return fallback;
};
