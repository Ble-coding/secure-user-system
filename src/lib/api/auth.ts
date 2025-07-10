import { apiRequest } from './config'

// Typage de l'utilisateur
export interface User {
  id: number
  name: string
  email: string
  phone?: string
  roles: string[]
  created_at?: string
  updated_at?: string
}

// Requêtes
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface UpdateProfileRequest {
  name?: string
  email?: string
  phone?: string
}

export interface UpdatePasswordRequest {
  current_password: string
  password: string
  password_confirmation: string
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
    }).then(res => res.data), // ✅ important : on retourne res.data

  logout: () =>
    apiRequest('/users/logout', {
      method: 'POST',
    }),

  me: () =>
    apiRequest<User>('/users/me'),

  updateProfile: (data: UpdateProfileRequest) =>
    apiRequest<User>('/users/me/update-info', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updatePassword: (data: UpdatePasswordRequest) =>
    apiRequest('/users/me/update-secret', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updatePhoto: (photoFile: File) => {
    const formData = new FormData()
    formData.append('photo', photoFile)

    return apiRequest<User>('/users/me/update-photo', {
      method: 'PUT',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
  },

  refreshToken: () =>
    apiRequest<{ data: LoginResponse }>('/users/refresh-token', {
      method: 'POST',
    }).then(res => res.data),

  logoutAll: () =>
    apiRequest('/users/logout-all', {
      method: 'POST',
    }),
}
