
import { apiRequest } from './config';
import { User } from './types';

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
