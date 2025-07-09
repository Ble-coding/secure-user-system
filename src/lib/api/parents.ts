
import { apiRequest } from './config';
import { ParentUser } from './types';

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
