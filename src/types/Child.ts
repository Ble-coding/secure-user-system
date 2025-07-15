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
