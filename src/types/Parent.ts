
export interface ParentUser {
  id: number
  nom: string
  prenom: string
  code: string // PA-123456-12345 (unique)
  email: string
  telephone: string
  adresse: string 
  status: string
  first_login?: boolean
  date_naissance?: string
  sexe?: string
  ville?: string
  photo?: string
  document_type?: string
  document_numero?: string
  document_file?: string
  pin_encrypted?: string
  user_id?: number
  password?: string
}

export interface PaginatedParentResponse {
  parent: ParentUser[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  new_this_month: number
  total_actifs: number
  total_inactifs: number
}
