
// Configuration de l'API pour Laravel
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Types pour les entités
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Actif' | 'Inactif';
  lastLogin: string;
  phone?: string;
}

export interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'En service' | 'Hors service' | 'En pause';
  zone: string;
  lastActivity: string;
}

export interface Parent {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  children: Child[];
  status: 'Actif' | 'Inactif';
}

export interface Child {
  id: number;
  name: string;
  age: number;
  class: string;
  parentId: number;
  status: 'Présent' | 'Absent' | 'Récupéré';
}

export interface Recuperator {
  id: number;
  name: string;
  email: string;
  phone: string;
  authorizedChildren: number[];
  status: 'Actif' | 'Inactif';
}

export interface Entry {
  id: number;
  childId: number;
  recuperatorId: number;
  agentId: number;
  entryTime: string;
  status: 'Entrée' | 'Sortie';
  notes?: string;
}

// Configuration des headers pour les requêtes
export const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
    'Accept': 'application/json',
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

  const response = await fetch(url, config);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Services API
export const authService = {
  login: (credentials: { email: string; password: string }) =>
    apiRequest<{ token: string; user: User }>('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData: { name: string; email: string; password: string }) =>
    apiRequest<{ token: string; user: User }>('/users/access', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  logout: () =>
    apiRequest('/users/logout', { method: 'POST' }),

  me: () =>
    apiRequest<User>('/users/me'),
};

export const userService = {
  getAll: () =>
    apiRequest<User[]>('/users-management/users-management'),

  getById: (id: number) =>
    apiRequest<User>(`/users-management/users-management/${id}`),

  create: (userData: Partial<User>) =>
    apiRequest<User>('/users-management/users-management', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  update: (id: number, userData: Partial<User>) =>
    apiRequest<User>(`/users-management/users-management/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  delete: (id: number) =>
    apiRequest(`/users-management/users-management/${id}`, {
      method: 'DELETE',
    }),
};

export const agentService = {
  getAll: () =>
    apiRequest<Agent[]>('/users/agents'),

  getById: (id: number) =>
    apiRequest<Agent>(`/users/agents/${id}`),

  create: (agentData: Partial<Agent>) =>
    apiRequest<Agent>('/users/agents', {
      method: 'POST',
      body: JSON.stringify(agentData),
    }),

  update: (id: number, agentData: Partial<Agent>) =>
    apiRequest<Agent>(`/users/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(agentData),
    }),

  delete: (id: number) =>
    apiRequest(`/users/agents/${id}`, {
      method: 'DELETE',
    }),
};

export const parentService = {
  getAll: () =>
    apiRequest<Parent[]>('/users/parents'),

  getById: (id: number) =>
    apiRequest<Parent>(`/users/parents/${id}`),

  create: (parentData: Partial<Parent>) =>
    apiRequest<Parent>('/users/parents', {
      method: 'POST',
      body: JSON.stringify(parentData),
    }),

  update: (id: number, parentData: Partial<Parent>) =>
    apiRequest<Parent>(`/users/parents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(parentData),
    }),

  delete: (id: number) =>
    apiRequest(`/users/parents/${id}`, {
      method: 'DELETE',
    }),
};

export const recuperatorService = {
  getAll: () =>
    apiRequest<Recuperator[]>('/users/recuperators'),

  getById: (id: number) =>
    apiRequest<Recuperator>(`/users/recuperators/${id}`),

  create: (recuperatorData: Partial<Recuperator>) =>
    apiRequest<Recuperator>('/users/recuperators', {
      method: 'POST',
      body: JSON.stringify(recuperatorData),
    }),

  update: (id: number, recuperatorData: Partial<Recuperator>) =>
    apiRequest<Recuperator>(`/users/recuperators/${id}`, {
      method: 'PUT',
      body: JSON.stringify(recuperatorData),
    }),

  delete: (id: number) =>
    apiRequest(`/users/recuperators/${id}`, {
      method: 'DELETE',
    }),

  generateQrCode: (recuperatorId: number, childId: number) =>
    apiRequest<{ qr_code: string }>(`/users/recuperators/${recuperatorId}/children/${childId}/qr-code`, {
      method: 'POST',
    }),
};

export const entryService = {
  getAll: () =>
    apiRequest<Entry[]>('/users/entries/all'),
};
