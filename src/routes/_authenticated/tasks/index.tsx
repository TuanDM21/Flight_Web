import { createFileRoute } from '@tanstack/react-router'
import $queryClient from '@/api'
import PageSkeleton from '@/components/page-skeleton'
import { TaskListPage } from '@/features/tasks'

export const getTaskListQueryOptions = () =>
  $queryClient.queryOptions('get', '/api/tasks')
export const Route = createFileRoute('/_authenticated/tasks/')({
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(getTaskListQueryOptions())
  },
  component: TaskListPage,
  pendingComponent: PageSkeleton,
})

export { Route as TaskListRoute }
