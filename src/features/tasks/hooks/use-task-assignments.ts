import $queryClient from '@/api'

export const getTaskAssignmentsQueryOptions = (taskId: number) =>
  $queryClient.queryOptions('get', `/api/assignments/task/{taskId}`, {
    params: {
      path: {
        taskId,
      },
    },
  })

export const useTaskAssignments = (taskId: number) => {
  return $queryClient.useQuery('get', `/api/assignments/task/{taskId}`, {
    params: {
      path: {
        taskId,
      },
    },
  })
}
