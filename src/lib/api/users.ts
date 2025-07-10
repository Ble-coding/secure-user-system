import { apiRequest } from './config'
import { ApiResponse } from '@/types/api'

export interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
  last_login?: string
    phone?: string      // Ajouté pour le téléphone
    photo?: string      // Ajouté pour la photo
}

export interface PaginatedUserResponse {
  users: User[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  new_this_month: number
  total_actifs: number
  total_inactifs: number
}


export const userService = {
    
  getAll: (page = 1, search = "", status = "") =>
    apiRequest<ApiResponse<PaginatedUserResponse>>(
        `/users-management/users-management?page=${page}&search=${encodeURIComponent(search)}&status=${status}`
    ),

  getById: (id: number) =>
    apiRequest<ApiResponse<User>>(`/users-management/users-management/${id}`),

    create: (userData: FormData) =>
    apiRequest<ApiResponse<User>>('/users-management/users-management', {
        method: 'POST',
        body: userData,
        // ❌ Ne PAS mettre "Content-Type": multipart/form-data → FormData le gère
        headers: {
        // Attention : laisser FormData gérer Content-Type
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
    }),

    update: (id: number, userData: FormData) =>
    apiRequest<ApiResponse<User>>(`/users-management/users-management/${id}`, {
        method: 'POST', // méthode POST avec override pour PUT
        headers: { },   // ⚠️ Ne PAS mettre Content-Type → FormData le gère automatiquement
        body: (() => {
        const form = userData
        form.append("_method", "PUT")
        return form
        })(),
    }),


  delete: (id: number) =>
    apiRequest<ApiResponse<null>>(`/users-management/users-management/${id}`, {
      method: 'DELETE',
    }),

      restore: (id: string) =>
    apiRequest<ApiResponse<User>>(`/users-management/users-management/${id}/restore`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      }
    }),
}
