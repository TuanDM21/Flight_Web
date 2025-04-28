import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import GeneralError from '~/components/errors/general-error'
import NotFoundError from '~/components/errors/not-found-error'
import { Toaster } from '~/components/ui/sonner'
import { AuthContext } from '~/context/auth'

interface AppRouterContext {
  queryClient: QueryClient
  auth: AuthContext
}

export const Route = createRootRouteWithContext<AppRouterContext>()({
  component: () => {
    return (
      <>
        <Outlet />
        <Toaster />
        {/* {import.meta.env.MODE === 'development' && (
          <>
            <ReactQueryDevtools buttonPosition='bottom-left' />
            <TanStackRouterDevtools position='bottom-right' />
          </>
        )} */}
      </>
    )
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
