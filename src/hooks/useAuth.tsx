
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/lib/api/auth';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/User';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const isAuthenticated = !!user;

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await authService.me();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('auth_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      localStorage.setItem('auth_token', response.token);
      setUser(response.user);
      toast({ title: "Connexion réussie" });
    } catch (error: any) {
      console.error('Login failed:', error);
      toast({
        title: "Erreur de connexion",
        description: error.message || "Email ou mot de passe incorrect",
        variant: "destructive"
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem('auth_token');
      setUser(null);
      toast({ 
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès"
      });
      window.location.href = '/login';
    } catch (error: any) {
      console.error('Logout failed:', error);
      localStorage.removeItem('auth_token');
      setUser(null);
      toast({
        title: "Déconnexion",
        description: "Vous avez été déconnecté localement",
        variant: "destructive"
      });
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
