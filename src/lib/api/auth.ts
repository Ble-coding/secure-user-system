
import { apiRequest } from './config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: any;
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
  login: (credentials: LoginRequest) =>
    apiRequest<LoginResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  logout: () =>
    apiRequest('/users/logout', {
      method: 'POST',
    }),

  me: () =>
    apiRequest<any>('/users/me'),

  updateProfile: (data: UpdateProfileRequest) =>
    apiRequest<any>('/users/me/update-info', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updatePassword: (data: UpdatePasswordRequest) =>
    apiRequest<any>('/users/me/update-secret', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updatePhoto: (photoFile: File) => {
    const formData = new FormData();
    formData.append('photo', photoFile);
    
    return apiRequest<any>('/users/me/update-photo', {
      method: 'PUT',
      body: formData,
      headers: {
        // Don't set Content-Type, let browser set it for FormData
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
  },

  refreshToken: () =>
    apiRequest<LoginResponse>('/users/refresh-token', {
      method: 'POST',
    }),

  logoutAll: () =>
    apiRequest('/users/logout-all', {
      method: 'POST',
    }),
};
