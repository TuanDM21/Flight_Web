import { createFileRoute } from '@tanstack/react-router'
import $queryClient from '@/api'
import EditTaskPage from '@/features/tasks/edit'

export const getTaskDetailQueryOptions = (taskId: number) =>
  $queryClient.queryOptions(
    'get',
    '/api/tasks/{id}',
    {
      params: {
        path: {
          id: taskId,
        },
      },
    },
    {}
  )

export const Route = createFileRoute('/_authenticated/tasks/$task-id/edit')({
  loader: ({ context: { queryClient }, params: { 'task-id': taskId } }) => {
    return queryClient.ensureQueryData(
      getTaskDetailQueryOptions(Number(taskId))
    )
  },
  component: EditTaskPage,
})

export { Route as EditTaskRoute }
