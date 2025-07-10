
// Configuration de l'API pour Laravel
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://kidpass.nady-group.com/api';
// export const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://kidpass.nady-group.com';
export const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://kidpass.nady-group.com/kidpass/public';


// Configuration des headers pour les requêtes
export const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };
};

// Fonction générique pour les requêtes API
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('auth_token');

  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    // ⚠️ NE PAS ajouter Content-Type si FormData
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  console.log('API Request:', url, config);

  const response = await fetch(url, config);

  console.log('API Response:', response.status, response.statusText);

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    console.error('API Error Response:', data);
    const message = data?.message || 'Erreur inconnue';
    throw new Error(message);
  }

  console.log('API Response Data:', data);
  return data;
};

