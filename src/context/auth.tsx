import * as React from 'react'
import $queryClient from '~/api'
import { AuthorizedUser, LoginCredentials } from '~/types/auth'

export interface AuthContext {
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  user: AuthorizedUser | null
}

const AuthContext = React.createContext<AuthContext | null>(null)

const tokenKey = 'tanstack.auth.token'

function getStoredToken() {
  return localStorage.getItem(tokenKey)
}

function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(tokenKey, token)
  } else {
    localStorage.removeItem(tokenKey)
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = React.useState<string | null>(getStoredToken())
  const isAuthenticated = !!token

  const loginMutation = $queryClient.useMutation('post', '/api/auth/login')
  const getMeQuery = $queryClient.useQuery(
    'get',
    '/api/users/me',
    {},
    {
      enabled: isAuthenticated,
    }
  )

  const logout = React.useCallback(async () => {
    setStoredToken(null)
    setToken(null)
  }, [])

  const login = React.useCallback(
    async (credentials: LoginCredentials) => {
      delete credentials.remember
      const response = await loginMutation.mutateAsync({
        body: credentials,
      })
      const token = response.data!.accessToken!
      setStoredToken(token)
      setToken(token)
    },
    [loginMutation]
  )

  const user = React.useMemo(() => {
    const user = getMeQuery.data?.data
    if (!user) return null

    return user
  }, [getMeQuery.data])

  React.useEffect(() => {
    setToken(getStoredToken())
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
