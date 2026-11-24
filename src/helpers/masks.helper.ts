export const onlyDigits = (value?: string | null): string =>
  (value ?? "").replace(/\D/g, "");

// Aplica um padrão em que "9" é um dígito: applyPattern("12345678900", "999.999.999-99").
// Funciona bem com o teclado numérico do iPad (o InputMask do PrimeVue perde o cursor no Safari).
export const applyPattern = (value: string, pattern: string): string => {
  const digits = onlyDigits(value);
  let result = "";
  let i = 0;
  for (const char of pattern) {
    if (i >= digits.length) break;
    if (char === "9") {
      result += digits[i++];
    } else {
      result += char;
    }
  }
  return result;
};

export const cpfMask = (value?: string | null) => applyPattern(value ?? "", "999.999.999-99");

export const dateMask = (value?: string | null) => applyPattern(value ?? "", "99/99/9999");

/**
 * Telefone brasileiro: (11) 1234-5678 ou (11) 91234-5678
 */
export function phoneMask(value?: string | null): string {
  const digits = onlyDigits(value).slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/**
 * Aceita 10 dígitos (fixo) ou 11 (celular, começando com 9 depois do DDD).
 */
export function isValidPhone(value: string): boolean {
  const digits = onlyDigits(value);
  if (digits.length !== 10 && digits.length !== 11) return false;
  const ddd = Number(digits.slice(0, 2));
  if (ddd < 11 || ddd > 99) return false;
  if (digits.length === 11 && digits[2] !== "9") return false;
  return true;
}

// Validação dos dígitos verificadores do CPF.
export function isValidCpf(value: string): boolean {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  const check = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(cpf[i]) * (len + 1 - i);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  return check(9) === Number(cpf[9]) && check(10) === Number(cpf[10]);
}

// Busca sem diferenciar maiúsculas nem acentos ("joao" encontra "João").
export const normalizeSearch = (value?: string | null): string =>
  (value ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
