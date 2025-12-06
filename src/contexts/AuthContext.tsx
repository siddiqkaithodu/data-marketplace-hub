import { createContext, useContext, ReactNode, useEffect, useState } from 'react'
import { User } from '@/types'
import * as api from '@/lib/api'

interface AuthContextType {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => void
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUserData = async () => {
    const userData = await api.getCurrentUser()
    setUser({
      id: String(userData.id),
      email: userData.email,
      name: userData.name,
      plan: userData.plan,
      apiKey: userData.api_key || undefined,
      createdAt: userData.created_at
    })
  }

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = api.getAccessToken()
      if (token) {
        try {
          await fetchUserData()
        } catch (error) {
          // Token is invalid or expired, remove it
          console.warn('Session expired:', error instanceof Error ? error.message : 'Unknown error')
          api.removeAccessToken()
        }
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    const tokenResponse = await api.signIn({ email, password })
    api.setAccessToken(tokenResponse.access_token)
    
    // Fetch user data after successful login
    await fetchUserData()
  }

  const signUp = async (email: string, password: string, name: string) => {
    // First register the user
    await api.signUp({ email, password, name })
    
    // Then sign in to get token
    const tokenResponse = await api.signIn({ email, password })
    api.setAccessToken(tokenResponse.access_token)
    
    // Fetch user data
    await fetchUserData()
  }

  const signOut = () => {
    api.removeAccessToken()
    setUser(null)
  }

  const refreshUser = async () => {
    const token = api.getAccessToken()
    if (token) {
      await fetchUserData()
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        signIn, 
        signUp, 
        signOut, 
        refreshUser,
        isAuthenticated: user !== null,
        isLoading
      }}
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
