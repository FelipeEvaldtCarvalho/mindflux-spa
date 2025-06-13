/**
 * Aplica máscara de telefone brasileiro
 * Suporta telefones fixos (8 dígitos) e celular (9 dígitos)
 * Formato: (11) 1234-5678 ou (11) 91234-5678
 */
export function phoneMask(value: string): string {
  if (!value) return "";

  // Remove todos os caracteres não numéricos
  const cleanValue = value.replace(/\D/g, "");

  // Se não há dígitos, retorna string vazia
  if (cleanValue.length === 0) return "";

  // Aplica máscara baseada no número de dígitos
  if (cleanValue.length <= 2) {
    // Apenas DDD
    return `(${cleanValue}`;
  } else if (cleanValue.length <= 6) {
    // DDD + início do número
    return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(2)}`;
  } else if (cleanValue.length <= 10) {
    // Telefone fixo: (11) 1234-5678
    return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(
      2,
      6
    )}-${cleanValue.slice(6)}`;
  } else {
    // Telefone celular: (11) 91234-5678
    return `(${cleanValue.slice(0, 2)}) ${cleanValue.slice(
      2,
      7
    )}-${cleanValue.slice(7, 11)}`;
  }
}

/**
 * Remove a máscara do telefone, retornando apenas os números
 */
export function removePhoneMask(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Valida se o telefone está no formato correto
 * Aceita telefones com 10 dígitos (fixo) ou 11 dígitos (celular)
 */
export function isValidPhone(value: string): boolean {
  const cleanValue = removePhoneMask(value);

  // Deve ter 10 ou 11 dígitos
  if (cleanValue.length !== 10 && cleanValue.length !== 11) {
    return false;
  }

  // DDD deve ser válido (11-99)
  const ddd = parseInt(cleanValue.slice(0, 2));
  if (ddd < 11 || ddd > 99) {
    return false;
  }

  // Se for celular (11 dígitos), o primeiro dígito após DDD deve ser 9
  if (cleanValue.length === 11 && cleanValue[2] !== "9") {
    return false;
  }

  return true;
}
