import { createContext, useContext, ReactNode } from 'react'
import { useKV } from '@github/spark/hooks'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useKV<User | null>('auth-user', null)

  const signIn = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      email,
      name: email.split('@')[0],
      plan: 'free',
      apiKey: `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString()
    }
    
    setUser(newUser)
  }

  const signUp = async (email: string, password: string, name: string) => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const newUser: User = {
      id: Math.random().toString(36).substring(7),
      email,
      name,
      plan: 'free',
      apiKey: `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString()
    }
    
    setUser(newUser)
  }

  const signOut = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user: user ?? null, 
        signIn, 
        signUp, 
        signOut, 
        isAuthenticated: user !== null && user !== undefined
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
