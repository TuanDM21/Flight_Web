import { createFileRoute, Outlet } from '@tanstack/react-router'

const RouteComponent = () => <Outlet />

export const Route = createFileRoute('/_authenticated/flights')({
  component: RouteComponent,
  loader: () => {
    return {
      crumb: 'Danh sách chuyến bay',
    }
  },
})
