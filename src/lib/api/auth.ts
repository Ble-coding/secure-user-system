import { apiRequest } from './config';
// import { User } from '@/types/User';
import { ApiResponse } from '@/types/api';

export interface Role {
  id: number
  name: string
  label?: string | null
}
export interface User {
  id: number
  name: string
  email: string
  phone?: string
  photo?: string
  roles: Role[]
  last_login?: string
  created_at?: string
  updated_at?: string
}

// Requêtes
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
}

export interface UpdatePasswordRequest {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export const authService = {
  register: (credentials: RegisterRequest) =>
    apiRequest<{ data: LoginResponse }>('/users/access', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }).then(res => res.data),

  login: (credentials: LoginRequest) =>
    apiRequest<{ data: LoginResponse }>('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }).then(res => res.data),

  logout: () =>
    apiRequest('/users/logout', {
      method: 'POST',
    }),

  me: () =>
    apiRequest<ApiResponse<{ user: User }>>('/users/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    }).then(res => res.data.user),

    
updateProfile: (data: UpdateProfileRequest) =>
  apiRequest<ApiResponse<{ user: User }>>('/users/me/update-info', {
    method: 'PUT',
    body: JSON.stringify(data),
  }).then(res => res.data.user),

  updatePassword: (data: UpdatePasswordRequest) =>
    apiRequest('/users/me/update-secret', {
      method: 'PUT',
      body: JSON.stringify({
        current_secret: data.current_password,
        new_secret: data.password,
        new_secret_confirmation: data.password_confirmation,
      }),
    }),

  updatePhoto: (photoFile: File) => {
  const formData = new FormData();
  formData.append('_method', 'PUT'); // ✅ Laravel comprendra que c'est une mise à jour
  formData.append('photo', photoFile); // ✅ Champ fichier

  return apiRequest<ApiResponse<{ user: User }>>('/users/me/update-photo', {
    method: 'POST', // ✅ Laravel accepte POST avec _method=PUT
    body: formData,
  })
    .then(res => {
      console.log("📸 Résultat update-photo:", res);
      return res.data?.user;
    })
    .catch(err => {
      console.error("❌ Erreur réseau ou parsing :", err);
      throw err;
    });
},


  refreshToken: () =>
    apiRequest<{ data: LoginResponse }>('/users/refresh-token', {
      method: 'POST',
    }).then(res => res.data),

  logoutAll: () =>
    apiRequest('/users/logout-all', {
      method: 'POST',
    }),
};
