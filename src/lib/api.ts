
// Configuration de l'API pour Laravel
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://kidpass.nady-group.com/api';

// Types pour les entités basés sur les modèles Laravel
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
  first_name: string;
  last_name: string;
  code: string;
  email: string;
  phone: string;
  type: string; // "enseignant", "surveillant", "sécurité"
  status: 'En service' | 'Hors service' | 'En pause';
  date_naissance?: string;
  sexe?: string;
  ville?: string;
  photo?: string;
  document_type?: string;
  document_numero?: string;
  document_file?: string;
  first_login?: boolean;
  pin_encrypted?: string;
  user_id?: number;
}

export interface ParentUser {
  id: number;
  nom: string;
  prenom: string;
  code: string;
  email: string;
  telephone: string;
  adresse: string;
  children: Child[];
  status: 'Actif' | 'Inactif';
  date_naissance?: string;
  photo?: string;
  sexe?: string;
  ville?: string;
  document_type?: string;
  document_numero?: string;
  document_file?: string;
  first_login?: boolean;
  pin_encrypted?: string;
  user_id?: number;
}

export interface Child {
  id: number;
  parent_id: number;
  first_name: string;
  last_name: string;
  code: string;
  gender: string;
  date_of_birth: string;
  photo?: string;
  class: string;
  enrolled_at?: string;
  status: 'Présent' | 'Absent' | 'Récupéré';
}

export interface Recuperator {
  id: number;
  parent_id: number;
  first_name: string;
  last_name: string;
  code: string;
  phone: string;
  relation_type: string;
  document_type?: string;
  document_file?: string;
  photo?: string;
  is_active: boolean;
  authorizedChildren: number[];
  status: 'Actif' | 'Inactif';
  identity_confirmation_at?: string;
  first_login?: boolean;
  pin_encrypted?: string;
  user_id?: number;
}

export interface ChildEntry {
  id: number;
  child_id: number;
  recuperator_id?: number;
  agent_id: number;
  type: 'entry' | 'exit';
  scanned_at: string;
  user_id?: number;
}

export interface Entry {
  id: number;
  childId: number;
  recuperatorId?: number;
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

  scanQrCode: (scanData: {
    child_id: string;
    parent_user_id: string;
    agent_id: string;
    recuperator_id?: string;
    type: 'entry' | 'exit';
    scanned_at?: string;
  }) =>
    apiRequest<{ entry: ChildEntry; warnings?: string[] }>('/agents/scan-qr-code', {
      method: 'POST',
      body: JSON.stringify(scanData),
    }),
};

export const parentService = {
  getAll: () =>
    apiRequest<ParentUser[]>('/users/parents'),

  getById: (id: number) =>
    apiRequest<ParentUser>(`/users/parents/${id}`),

  create: (parentData: Partial<ParentUser>) =>
    apiRequest<ParentUser>('/users/parents', {
      method: 'POST',
      body: JSON.stringify(parentData),
    }),

  update: (id: number, parentData: Partial<ParentUser>) =>
    apiRequest<ParentUser>(`/users/parents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(parentData),
    }),

  delete: (id: number) =>
    apiRequest(`/users/parents/${id}`, {
      method: 'DELETE',
    }),
};

export const childService = {
  getAll: () =>
    apiRequest<Child[]>('/users/children'),

  getById: (id: number) =>
    apiRequest<Child>(`/users/children/${id}`),

  create: (childData: Partial<Child>) =>
    apiRequest<Child>('/users/children', {
      method: 'POST',
      body: JSON.stringify(childData),
    }),

  update: (id: number, childData: Partial<Child>) =>
    apiRequest<Child>(`/users/children/${id}`, {
      method: 'PUT',
      body: JSON.stringify(childData),
    }),

  delete: (id: number) =>
    apiRequest(`/users/children/${id}`, {
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
    apiRequest<ChildEntry[]>('/users/entries/all'),

  create: (entryData: Partial<ChildEntry>) =>
    apiRequest<ChildEntry>('/users/entries', {
      method: 'POST',
      body: JSON.stringify(entryData),
    }),
};

// Compatibilité avec l'ancien type Parent
export type Parent = ParentUser;
