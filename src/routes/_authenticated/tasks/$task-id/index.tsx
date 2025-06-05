import { createFileRoute } from '@tanstack/react-router'
import PageDetailSkeleton from '@/components/page-detail-skeleton'
import TaskDetailPage from '@/features/tasks/detail'
import { getTaskDetailQueryOptions } from '@/features/tasks/hooks/use-task-detail'

export const Route = createFileRoute('/_authenticated/tasks/$task-id/')({
  component: TaskDetailPage,
  pendingComponent: PageDetailSkeleton,
  loader: ({ context: { queryClient }, params: { 'task-id': taskId } }) => {
    return queryClient.ensureQueryData(
      getTaskDetailQueryOptions(Number(taskId))
    )
  },
})

export { Route as TaskDetailRoute }
