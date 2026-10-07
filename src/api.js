// ─── Configuração da API ─────────────────────────────────────
// URL base da API, configurável via variável de ambiente
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Função auxiliar para fazer requisições à API.
 * Adiciona automaticamente o token JWT se disponível.
 */
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const config = {
    ...options,
    headers: {
      ...(options.headers || {}),
    },
  };

  // Adiciona Content-Type JSON se não for FormData
  if (!(options.body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  // Adiciona o token de autenticação
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw { status: response.status, ...data };
  }

  return data;
}

/**
 * Formata um valor numérico para moeda brasileira (R$ 105,00)
 */
export function formatarPreco(valor) {
  const num = Number(valor);
  if (isNaN(num)) return 'R$ 0,00';
  const parts = num.toFixed(2).split('.');
  const inteiro = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${inteiro},${parts[1]}`;
}

export { API_URL };
export default apiFetch;
