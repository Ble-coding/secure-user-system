
import { apiRequest } from './config';
import { Child } from './types';
import { ApiResponse } from '@/types/api';

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
    restore: (code: string) =>
    apiRequest<ApiResponse<Child>>(`/users/children/${code}/restore`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      }
    }),
};
