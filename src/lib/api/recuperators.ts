
import { apiRequest } from './config';
import { Recuperator } from './types';
import { ApiResponse } from '@/types/api';

export const recuperatorService = {
  getAll: () =>
    apiRequest<Recuperator[]>('/users/recuperators'),

  getById: (id: number) =>
    apiRequest<Recuperator>(`/users/recuperators/${id}`),

  create: (recuperatorData: FormData) =>
    apiRequest<ApiResponse<Recuperator>>('/users/recuperators', {
      method: 'POST',
      body: recuperatorData,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    }),

  update: (id: number, recuperatorData: FormData) =>
    apiRequest<ApiResponse<Recuperator>>(`/users/recuperators/${id}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      body: (() => {
        const form = recuperatorData
        form.append("_method", "PUT")
        return form
      })(),
    }),

  delete: (id: number) =>
    apiRequest(`/users/recuperators/${id}`, {
      method: 'DELETE',
    }),

  restore: (code: string) =>
    apiRequest<ApiResponse<Recuperator>>(`/users/recuperators/${code}/restore`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      }
    }),

  generateQrCode: (recuperatorId: number, childId: number) =>
    apiRequest<{ qr_code: string }>(`/users/recuperators/${recuperatorId}/children/${childId}/qr-code`, {
      method: 'POST',
    }),
};
