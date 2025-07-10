
export interface Agent {
  id: number
  first_name: string
  last_name: string
  code: string // AG-123456-12345 (unique)
  email: string
  phone: string
  type: string // "enseignant", "surveillant", "sécurité", "administration"
  status: 'En service' | 'Hors service' | 'En pause'
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

export interface PaginatedAgentResponse {
  agents: Agent[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  new_this_month: number
  total_en_service: number
  total_hors_service: number
  total_en_pause: number
}
