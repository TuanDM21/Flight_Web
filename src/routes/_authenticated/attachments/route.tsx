import { createFileRoute, Outlet } from '@tanstack/react-router'

const RouteComponent = () => <Outlet />

export const Route = createFileRoute('/_authenticated/attachments')({
  component: RouteComponent,
  loader: () => {
    return {
      crumb: 'Danh sách tệp đính kèm',
    }
  },
})
