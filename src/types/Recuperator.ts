import { Child } from './Child'

export interface Recuperator {
  id: number
  code: string
  first_name: string
  last_name: string
  phone: string
  relation_type: string
  document_type: string | null
  document_numero?: string | null
   sexe?: "M" | "F" | null
  document_file?: string | null
  is_active: boolean
  photo?: string | null
  identity_confirmation_at?: string | null
  first_login?: boolean
  password?: string
  pin_encrypted?: string | null
  created_at?: string
  updated_at?: string
  deleted_at?: string | null

  children?: Child[]
  parent_id?: string
  parent?: {
    id: number
    code: string
    prenom: string
    nom: string
    email: string
  }
  user_id?: number
}

export interface PaginatedRecuperatorResponse {
  recuperators: Recuperator[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  total_actifs: number
  total_inactifs: number
  new_this_month: number
}
