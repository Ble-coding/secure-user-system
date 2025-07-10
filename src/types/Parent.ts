export interface Child {
  id: number
  parent_id: number
  first_name: string
  last_name: string
  gender: "M" | "F"
  date_of_birth: string
  class?: string | null
  enrolled_at?: string | null
  photo?: string | null
  code: string
  parent_verified_at?: string | null
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export interface ParentUser {
  id: number
  nom: string
  prenom: string
  email: string
  telephone: string
  adresse?: string | null
  code: string
  status?: string // ← ce champ n’est pas dans le modèle mais tu peux le garder si tu l’utilises côté front
  sexe?: string | null
  ville?: string | null
  photo?: string | null
  document_type?: string | null
  document_numero?: string | null
  document_file?: string | null
  first_login?: boolean
  date_naissance?: string | null
  user_id?: number | null
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  children?: Child[]
}

export interface PaginatedParentResponse {
  parents: ParentUser[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  new_this_month: number
  total_actifs: number
  total_inactifs: number
}
