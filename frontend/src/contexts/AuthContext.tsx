import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface AuthContextType {
  isAuthenticated: boolean
  token: string | null
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('access_token')
  })
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('access_token')
  })

  const login = (newToken: string) => {
    console.log('🔐 AuthContext: Logging in with token')
    localStorage.setItem('access_token', newToken)
    setToken(newToken)
    setIsAuthenticated(true)
  }

  const logout = () => {
    console.log('🚪 AuthContext: Logging out')
    localStorage.removeItem('access_token')
    setToken(null)
    setIsAuthenticated(false)
  }

  // Sync with localStorage changes (for multi-tab support)
  useEffect(() => {
    const handleStorageChange = () => {
      const storedToken = localStorage.getItem('access_token')
      if (storedToken !== token) {
        setToken(storedToken)
        setIsAuthenticated(!!storedToken)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [token])

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
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
