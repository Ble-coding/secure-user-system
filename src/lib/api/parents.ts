
import { apiRequest } from './config';
import { ParentUser } from './types';
import { ApiResponse } from '@/types/api';

export const parentService = {
  getAll: () =>
    apiRequest<ParentUser[]>('/users/parents'),

  getById: (id: number) =>
    apiRequest<ParentUser>(`/users/parents/${id}`),

  create: (parentData: FormData) =>
    apiRequest<ApiResponse<ParentUser>>('/users/parents', {
      method: 'POST',
      body: parentData,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    }),

  update: (id: number, parentData: FormData) =>
    apiRequest<ApiResponse<ParentUser>>(`/users/parents/${id}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      body: (() => {
        const form = parentData
        form.append("_method", "PUT")
        return form
      })(),
    }),

  delete: (id: number) =>
    apiRequest(`/users/parents/${id}`, {
      method: 'DELETE',
    }),

  restore: (code: string) =>
    apiRequest<ApiResponse<ParentUser>>(`/users/parents/${code}/restore`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      }
    }),
};
