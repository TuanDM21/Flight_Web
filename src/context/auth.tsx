import * as React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { AUTH_TOKEN_KEY } from '@/config/auth'
import { AuthorizedUser, LoginCredentials } from '@/types/auth'
import { useLocalStorage } from 'react-use'
import { toast } from 'sonner'

export interface AuthContext {
  isAuthenticated: boolean
  isLoading: boolean
  user: AuthorizedUser | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

const AuthContext = React.createContext<AuthContext | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const [token, setToken, removeToken] = useLocalStorage<string | null>(
    AUTH_TOKEN_KEY,
    null,
    { raw: true }
  )

  const [user, setUser] = React.useState<AuthorizedUser | null>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(!!token)
  const isAuthenticated = token != null

  const loginMutation = $queryClient.useMutation('post', '/api/auth/login')

  const getMeQuery = $queryClient.useQuery(
    'get',
    '/api/users/me',
    {},
    {
      enabled: isAuthenticated,
      retry: 1,
      retryDelay: 1000,
    }
  )

  const reset = React.useCallback(() => {
    removeToken()

    setUser(null)

    void queryClient.invalidateQueries({ queryKey: ['get', '/api/users/me'] })
    queryClient.clear()
  }, [queryClient, removeToken])

  const logout = React.useCallback(() => {
    reset()
  }, [reset])

  const login = React.useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoading(true)

      const { remember, ...loginData } = credentials

      const loginPromise = loginMutation.mutateAsync({
        body: loginData,
      })

      toast.promise(loginPromise, {
        loading: 'Logging in...',
        success: (data) => {
          const newToken = data?.data?.accessToken
          setToken(newToken)

          setIsLoading(false)
          return 'Login successful!'
        },
      })
    },
    [loginMutation, setToken]
  )

  React.useEffect(() => {
    if (getMeQuery.data?.data) {
      setUser(getMeQuery.data.data)
    }
  }, [getMeQuery.data])

  const contextValue = React.useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      login,
      logout,
    }),
    [isAuthenticated, isLoading, user, login, logout]
  )

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

/**
 * Hook to use the auth context
 */
export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
