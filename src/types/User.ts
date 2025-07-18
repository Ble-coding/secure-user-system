export interface Role {
  id: number
  name: string
  label?: string | null
}

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  photo?: string
  roles: Role[]
  last_login?: string
  created_at?: string
  updated_at?: string
}
