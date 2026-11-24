import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

// A API trabalha com datas puras "AAAA-MM-DD", sem hora nem fuso.
// Nunca use new Date("AAAA-MM-DD"): o navegador lê como UTC e, no Brasil, mostra o dia anterior.

export const formatDateToAPI = (date: Date): string => {
  if (!date) return "";
  return dayjs(date).format("YYYY-MM-DD");
};

// "AAAA-MM-DD" -> Date à meia-noite local (para DatePicker e cálculos).
export const parseApiDate = (value?: string | null): Date | undefined => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value ?? "");
  if (!match) return undefined;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
};

export const formatDateToDisplay = (value?: string | Date | null): string => {
  if (!value) return "";
  const date = typeof value === "string" ? parseApiDate(value) : value;
  return date ? dayjs(date).format("DD/MM/YYYY") : "";
};

// Ex.: "terça-feira, 24 de novembro"
export const formatLongDate = (date: Date): string =>
  dayjs(date).format("dddd, D [de] MMMM");

// "dd/mm/aaaa" digitado -> "AAAA-MM-DD" (ou null se incompleto/inválido)
export const displayDateToAPI = (value?: string | null): string | null => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value ?? "");
  if (!match) return null;
  const [, d, m, y] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  if (
    date.getFullYear() !== Number(y) ||
    date.getMonth() !== Number(m) - 1 ||
    date.getDate() !== Number(d)
  ) {
    return null;
  }
  return `${y}-${m}-${d}`;
};

export const todayAPI = (): string => dayjs().format("YYYY-MM-DD");
