
import { apiRequest } from './config';
import { ApiResponse } from '@/types/api';
import { ParentUser, PaginatedParentResponse } from '@/types/Parent';

export const parentService = {
  getAll: (page = 1, search = "", status = "") =>
    apiRequest<ApiResponse<PaginatedParentResponse>>(
      `/users/parents?page=${page}&search=${encodeURIComponent(search)}&status=${status}`
    ),

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
