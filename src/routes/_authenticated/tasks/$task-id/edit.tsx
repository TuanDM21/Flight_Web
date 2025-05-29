import { createFileRoute } from '@tanstack/react-router'
import EditTaskPage from '@/features/tasks/edit'
import { getTaskDetailQueryOptions } from '@/features/tasks/hooks/use-view-task-detail'

export const Route = createFileRoute('/_authenticated/tasks/$task-id/edit')({
  loader: ({ context: { queryClient }, params: { 'task-id': taskId } }) => {
    return queryClient.ensureQueryData(
      getTaskDetailQueryOptions(Number(taskId))
    )
  },
  component: EditTaskPage,
})

export { Route as EditTaskRoute }
