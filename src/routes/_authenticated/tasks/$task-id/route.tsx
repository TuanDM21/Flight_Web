import { createFileRoute, Outlet } from '@tanstack/react-router'

const RouteComponent = () => <Outlet />
export const Route = createFileRoute('/_authenticated/tasks/$task-id')({
  component: RouteComponent,
  loader: ({ params: { 'task-id': taskId } }) => {
    return {
      crumb: 'Công việc chi tiết' + ` #${taskId}`,
    }
  },
})
