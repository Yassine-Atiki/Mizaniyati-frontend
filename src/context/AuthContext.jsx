import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import * as authApi from '../api/authApi'

export const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  isAuthenticated: false,
  isDemo: false,
  login: async () => {},
  demoLogin: () => {},
  logout: () => {},
})

const TOKEN_KEY = 'mizaniyati_token'
const USER_KEY = 'mizaniyati_user'
const DEMO_TOKEN = 'demo-token'
const DEMO_USER = {
  id: 'demo',
  username: 'Demo User',
  email: 'demo@mizaniyati.app',
  currency: 'MAD',
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY)
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(true)

  const hydrateProfile = useCallback(async () => {
    if (!token) {
      setLoading(false)
      return
    }

    if (token === DEMO_TOKEN) {
      setUser(DEMO_USER)
      setLoading(false)
      return
    }

    try {
      const profile = await authApi.getProfile()
      if (profile) {
        setUser(profile)
        localStorage.setItem(USER_KEY, JSON.stringify(profile))
      }
    } catch (error) {
      setToken(null)
      setUser(null)
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    hydrateProfile()
  }, [hydrateProfile])

  const login = useCallback(async (credentials) => {
    const response = await authApi.login(credentials)
    const authToken = response?.token || response?.accessToken || response?.jwt
    if (!authToken) {
      throw new Error('Token manquant dans la réponse de connexion.')
    }
    setToken(authToken)
    localStorage.setItem(TOKEN_KEY, authToken)

    if (response?.user) {
      setUser(response.user)
      localStorage.setItem(USER_KEY, JSON.stringify(response.user))
    }

    return response
  }, [])

  const demoLogin = useCallback(() => {
    setToken(DEMO_TOKEN)
    setUser(DEMO_USER)
    localStorage.setItem(TOKEN_KEY, DEMO_TOKEN)
    localStorage.setItem(USER_KEY, JSON.stringify(DEMO_USER))
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token),
      isDemo: token === DEMO_TOKEN,
      login,
      demoLogin,
      logout,
    }),
    [user, token, loading, login, demoLogin, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
