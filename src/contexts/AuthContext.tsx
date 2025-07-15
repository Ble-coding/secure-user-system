import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from 'react'
import { authService, User as ApiUser } from '@/lib/api/auth'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'

// Typage enrichi
interface User extends ApiUser {
  role: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<boolean>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()

  const isAuthenticated = !!user

  const checkAuth = async (): Promise<boolean> => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      setIsLoading(false)
      return false
    }

    try {
      const userData = await authService.me()
      const userWithRole: User = {
        ...userData,
        role: userData.roles?.[0] || 'user',
      }
      setUser(userWithRole)
      return true
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('auth_token')
      setUser(null)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password })
    if (!response.token) throw new Error("Token manquant dans la réponse API")
    localStorage.setItem('auth_token', response.token)
    setUser({
      ...response.user,
      role: response.user.roles?.[0] || 'user',
    })
    toast({ title: 'Connexion réussie' })
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setUser(null)
    navigate('/auth/login')
    toast({ title: 'Déconnexion réussie' })
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  )
}
