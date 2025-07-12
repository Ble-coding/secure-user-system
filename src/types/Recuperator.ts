
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
  parent_id?: number
  user_id?: number
}

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
