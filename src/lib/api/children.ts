
import { apiRequest } from './config';
import { Child } from './types';
import { ApiResponse } from '@/types/api';

export const childService = {
  // Récupérer tous les enfants d'un parent spécifique
  getByParent: (parentCodeOrId: string) =>
    apiRequest<Child[]>(`/users/parents/${encodeURIComponent(parentCodeOrId)}/children`),

  // Récupérer un enfant par son ID
  getById: (id: number) =>
    apiRequest<Child>(`/users/children/${id}`),

  // Créer un enfant
  create: (childData: FormData) =>
    apiRequest<ApiResponse<Child>>('/users/children', {
      method: 'POST',
      body: childData,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    }),

  // Mettre à jour un enfant
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

  // Supprimer un enfant
  delete: (id: number) =>
    apiRequest(`/users/children/${id}`, {
      method: 'DELETE',
    }),

  // Restaurer un enfant
  restore: (code: string) =>
    apiRequest<ApiResponse<Child>>(`/users/children/${code}/restore`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      }
    }),

  // Nouvelle méthode pour récupérer tous les enfants (en récupérant d'abord tous les parents)
  getAll: async () => {
    // Cette méthode pourrait nécessiter de récupérer les enfants via les parents
    // Pour l'instant, nous retournons un tableau vide et vous devrez adapter selon vos besoins
    console.warn('childService.getAll() : Cette méthode doit être adaptée selon votre API')
    return []
  },
};
