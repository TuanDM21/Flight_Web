import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { NuqsAdapter } from 'nuqs/adapters/react'
import { toast } from 'sonner'
import { AuthProvider, useAuth } from './context/auth'
import { FontProvider } from './context/font-context'
import { ThemeProvider } from './context/theme-context'
import './index.css'
import { loadEnvVariables } from './lib/env'
import { FetchError } from './models/fetch-error'
import { routeTree } from './routeTree.gen'

loadEnvVariables()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: import.meta.env.PROD,
      staleTime: 10 * 1000,
    },
    mutations: {
      onError: (error) => {
        toast.error(error.message)
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof FetchError) {
        if (FetchError.isHttpError(error, 401)) {
          toast.error('Session expired!')
          const redirect = router.history.location.href
          void router.navigate({ to: '/sign-out', search: { redirect } })
        }
        if (FetchError.isServerError(error)) {
          toast.error('Internal Server Error!')
          void router.navigate({ to: '/500' })
        }
      }
    },
  }),
})

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
    queryClient,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export function App() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

const rootElement = document.querySelector('#root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <NuqsAdapter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
              <FontProvider>
                <App />
              </FontProvider>
            </ThemeProvider>
          </AuthProvider>
        </QueryClientProvider>
      </NuqsAdapter>
    </StrictMode>
  )
}
