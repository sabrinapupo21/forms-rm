// src/utils/formatters.js

// Máscara para CPF (000.000.000-00)
export function formatCPF(value) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

// Máscara para Telefone ((00) 00000-0000)
export function formatPhone(value) {
  value = value.replace(/\D/g, "").slice(0, 11);

  if (value.length <= 10) {
    return value
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return value
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

// Máscara para Moeda (R$ 0,00)
export function formatCurrency(value) {
  const digitsOnly = value.replace(/\D/g, "");
  if (!digitsOnly) return "";

  const amount = parseFloat(digitsOnly) / 100;

  return amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
export function formatDate(value) {
  return value
    .replace(/\D/g, "") // Remove tudo que não é número
    .slice(0, 8) // Limita a 8 dígitos (DDMMYYYY)
    .replace(/(\d{2})(\d)/, "$1/$2") // Adiciona a primeira barra
    .replace(/(\d{2})\/(\d{2})(\d)/, "$1/$2/$3"); // Adiciona a segunda barra
}
