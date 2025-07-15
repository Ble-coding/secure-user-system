import { apiRequest } from './config'
import { Recuperator } from '@/types/Recuperator'
import { PaginatedRecuperatorResponse } from '@/types/Recuperator'
import { ApiResponse } from '@/types/api'
import { ParentUser, PaginatedParentResponse } from '@/types/Parent'

export const recuperatorService = {
// lib/api/recuperators.ts
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

update: (code: string, formData: FormData): Promise<ApiResponse<Recuperator>> =>
  apiRequest<ApiResponse<Recuperator>>(`/users/recuperators/${code}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
    },
    body: (() => {
      formData.append('_method', 'PUT')
      return formData
    })(),
  }),


    getParentsSelect: (page = 1, search = "") =>
  apiRequest<ApiResponse<PaginatedParentResponse>>(
    `/users/parents/parents-select-all?page=${page}&search=${encodeURIComponent(search)}`
  ),

  getParentByCode: async (code: string): Promise<ParentUser> => {
    const response = await apiRequest<ApiResponse<ParentUser>>(`/users/parents/${code}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    })
    return response.data
  },

      delete: (code: string) =>
        apiRequest<ApiResponse<null>>(`/users/recuperators/${encodeURIComponent(code)}`, {
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
