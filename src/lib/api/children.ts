
import { apiRequest } from './config';
import { Child } from './types';
import { ApiResponse } from '@/types/api';

interface ChildWithRelations extends Child {
  deleted_at?: string | null;
  parent?: {
    id: number;
    prenom: string;
    nom: string;
    email: string;
    code?: string;
    telephone?: string;
  };
  recuperators: Array<{
    id: number;
    code: string;
    first_name: string;
    last_name: string;
  }>;
  entry_count: number;
  exit_count: number;
  last_scanned_at?: string;
  last_activities: Array<{
    id: number;
    type: 'entry' | 'exit';
    status: string;
    scanned_at: string;
    recuperator?: {
      full_name: string;
      code: string;
      photo?: string;
    };
  }>;
}

interface PaginatedChildrenResponse {
  children: ChildWithRelations[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  // Ajout des statistiques globales
  total_present: number;
  total_exited: number;
  total_no_activity: number;
  total_entries_count: number;
}

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

  // Récupérer tous les enfants avec leurs relations
  getAllWithRelations: (page = 1, search = "") =>
    apiRequest<ApiResponse<PaginatedChildrenResponse>>(
      `/users/children-with-relations?page=${page}&search=${encodeURIComponent(search)}`
    ),

  // Ancienne méthode pour compatibilité
  getAll: async () => {
    console.warn('childService.getAll() : Cette méthode doit être adaptée selon votre API')
    return []
  },
};

export type { ChildWithRelations, PaginatedChildrenResponse };
