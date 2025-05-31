import { createFileRoute } from '@tanstack/react-router'
import PageTableSkeleton from '@/components/page-table-skeleton'
import { TaskListPage } from '@/features/tasks'
import { getTaskListQueryOptions } from '@/features/tasks/hooks/use-view-task'

export const Route = createFileRoute('/_authenticated/tasks/')({
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(getTaskListQueryOptions())
  },
  component: TaskListPage,
  pendingComponent: PageTableSkeleton,
})

export { Route as TaskListRoute }
