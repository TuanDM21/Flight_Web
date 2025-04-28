import { useState } from 'react'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import KBar from '~/components/kbar'
import AppSidebar from '~/components/layout/app-sidebar'
import Header from '~/components/layout/header'
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: BaseRouteLayout,
})

function BaseRouteLayout() {
  const [defaultOpen] = useState(true)

  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  )
}
