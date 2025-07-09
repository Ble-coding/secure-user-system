
import { apiRequest } from './config';
import { User } from './types';

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
