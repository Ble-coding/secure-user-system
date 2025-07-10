export interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
  last_login?: string
    phone?: string      // ✅ Ajouté
  photo?: string   
}