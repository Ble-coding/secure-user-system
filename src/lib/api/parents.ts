import { apiRequest } from './config'
import { ApiResponse } from '@/types/api'
import { ParentUser, PaginatedParentResponse } from '@/types/Parent'
import { Child } from '@/types/Child'

export const parentService = {
  // 🔎 Récupérer tous les parents (avec pagination, recherche, filtre)
  getAll: (page = 1, search = "", status = "") =>
    apiRequest<ApiResponse<PaginatedParentResponse>>(
      `/users/parents?page=${page}&search=${encodeURIComponent(search)}&status=${status}`
    ),

  // 🔎 Récupérer un parent par son code (et non id)
  getByCode: (code: string) =>
    apiRequest<ApiResponse<ParentUser>>(`/users/parents/${encodeURIComponent(code)}`),

  // ➕ Créer un parent avec enfants et récupérateur
  create: (formData: FormData): Promise<ApiResponse<ParentUser>> =>
    apiRequest<ApiResponse<ParentUser>>('/users/parents', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      body: formData,
    }),

  // ✏️ Mettre à jour un parent via code (et non id)
  update: (code: string, formData: FormData): Promise<ApiResponse<ParentUser>> =>
    apiRequest<ApiResponse<ParentUser>>(`/users/parents/${encodeURIComponent(code)}`, {
      method: 'POST', // avec override _method
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      body: (() => {
        formData.append('_method', 'PUT')
        return formData
      })(),
    }),

  // ❌ Supprimer un parent
  delete: (code: string) =>
    apiRequest<ApiResponse<null>>(`/users/parents/${encodeURIComponent(code)}`, {
      method: 'DELETE',
    }),


  // ♻️ Restaurer un parent supprimé (soft deleted)
  restore: (code: string) =>
    apiRequest<ApiResponse<ParentUser>>(`/users/parents/${encodeURIComponent(code)}/restore`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    }),
}
