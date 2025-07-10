
import { apiRequest } from './config';
import { Recuperator } from './types';
import { ApiResponse } from '@/types/api'

export const recuperatorService = {
  getAll: () =>
    apiRequest<Recuperator[]>('/users/recuperators'),

  getById: (id: number) =>
    apiRequest<Recuperator>(`/users/recuperators/${id}`),

  create: (recuperatorData: Partial<Recuperator>) =>
    apiRequest<Recuperator>('/users/recuperators', {
      method: 'POST',
      body: JSON.stringify(recuperatorData),
    }),

  update: (id: number, recuperatorData: Partial<Recuperator>) =>
    apiRequest<Recuperator>(`/users/recuperators/${id}`, {
      method: 'PUT',
      body: JSON.stringify(recuperatorData),
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
