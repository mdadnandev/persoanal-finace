import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Initialize from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('finance_token')
      const savedUser = localStorage.getItem('finance_user')

      if (token && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser)
          setUser(parsedUser)
          setIsAuthenticated(true)
          // Verify token with server
          const freshUser = await authService.getCurrentUser()
          setUser(freshUser)
          localStorage.setItem('finance_user', JSON.stringify(freshUser))
        } catch (err) {
          clearAuth()
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials)
    localStorage.setItem('finance_token', data.token)
    localStorage.setItem('finance_user', JSON.stringify(data))
    setUser(data)
    setIsAuthenticated(true)
    toast.success(`Welcome back, ${data.name}! 👋`)
    return data
  }, [])

  const register = useCallback(async (userData) => {
    const data = await authService.register(userData)
    localStorage.setItem('finance_token', data.token)
    localStorage.setItem('finance_user', JSON.stringify(data))
    setUser(data)
    setIsAuthenticated(true)
    toast.success(`Account created! Welcome, ${data.name}! 🎉`)
    return data
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    toast.success('Logged out successfully')
  }, [])

  const clearAuth = () => {
    localStorage.removeItem('finance_token')
    localStorage.removeItem('finance_user')
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
