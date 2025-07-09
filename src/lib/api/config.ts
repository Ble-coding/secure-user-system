
// Configuration de l'API pour Laravel
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://kidpass.nady-group.com/api';

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
  const config: RequestInit = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  console.log('API Request:', url, config);

  const response = await fetch(url, config);
  
  console.log('API Response:', response.status, response.statusText);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error Response:', errorText);
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log('API Response Data:', data);
  return data;
};
