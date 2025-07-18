import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { authService, User as ApiUser } from '@/lib/api/auth'
import { useToast } from '@/hooks/use-toast'

// Redéfinition complète avec rôle requis
interface User extends ApiUser {
  role: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const isAuthenticated = !!user

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      fetchUser()
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const userData = await authService.me()
      // On force un rôle générique si non défini côté API
      const userWithRole: User = {
        ...userData,
         role: userData.roles?.[0]?.name || 'user',

      }
      setUser(userWithRole)
    } catch (error) {
      console.error('Échec de récupération de l’utilisateur :', error)
      localStorage.removeItem('auth_token')
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password })
      localStorage.setItem('auth_token', response.token)

      const userWithRole: User = {
        ...response.user,
       role: response.user.roles?.[0]?.name || 'user',
      }

      setUser(userWithRole)

      toast({ title: 'Connexion réussie' })
    } catch (error: unknown) {
      console.error('Échec de la connexion :', error)
      toast({
        title: 'Erreur de connexion',
        description:
          (error as Error).message || 'Email ou mot de passe incorrect',
        variant: 'destructive',
      })
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setUser(null)
    toast({ title: 'Déconnexion réussie' })
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
