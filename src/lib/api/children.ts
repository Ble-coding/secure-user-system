
import { apiRequest } from './config';
import { Child } from './types';
import { ApiResponse } from '@/types/api';

export const childService = {
  getAll: () =>
    apiRequest<Child[]>('/users/children'),

  getById: (id: number) =>
    apiRequest<Child>(`/users/children/${id}`),

  create: (childData: FormData) =>
    apiRequest<ApiResponse<Child>>('/users/children', {
      method: 'POST',
      body: childData,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    }),

  update: (id: number, childData: FormData) =>
    apiRequest<ApiResponse<Child>>(`/users/children/${id}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      body: (() => {
        const form = childData
        form.append("_method", "PUT")
        return form
      })(),
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
