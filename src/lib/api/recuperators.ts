
import { apiRequest } from './config'
import { Recuperator } from '@/types/Recuperator'
import { PaginatedRecuperatorResponse } from '@/types/PaginatedRecuperatorResponse'
import { ApiResponse } from '@/types/api'

export const recuperatorService = {
  getAll: (page = 1, search = "", status = "") =>
    apiRequest<ApiResponse<PaginatedRecuperatorResponse>>(
      `/users/recuperators?page=${page}&search=${encodeURIComponent(search)}&status=${status}`
    ),

  getById: (code: string) =>
    apiRequest<ApiResponse<Recuperator>>(`/users/recuperators/${code}`),

  create: (recuperatorData: FormData) =>
    apiRequest<ApiResponse<Recuperator>>('/users/recuperators', {
      method: 'POST',
      body: recuperatorData,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    }),

  update: (code: string, recuperatorData: FormData) =>
    apiRequest<ApiResponse<Recuperator>>(`/users/recuperators/${code}`, {
      method: 'POST',
      body: (() => {
        recuperatorData.append('_method', 'PUT')
        return recuperatorData
      })(),
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    }),

  delete: (code: string) =>
    apiRequest<ApiResponse<null>>(`/users/recuperators/${code}`, {
      method: 'DELETE',
    }),

  restore: (code: string) =>
    apiRequest<ApiResponse<Recuperator>>(`/users/recuperators/${code}/restore`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    }),

  generateQrCode: (recuperatorId: number, childId: number) =>
    apiRequest<{ qr_code: string }>(`/users/recuperators/${recuperatorId}/children/${childId}/qr-code`, {
      method: 'POST',
    }),
}
