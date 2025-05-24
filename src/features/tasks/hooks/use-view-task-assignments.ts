import $queryClient from '@/api'

export const getTaskAssignmentsQueryOptions = (taskId: number) =>
  $queryClient.queryOptions('get', `/api/assignments/task/{taskId}`, {
    params: {
      path: {
        taskId,
      },
    },
  })

export const useViewTaskAssignments = (taskId: number) => {
  return $queryClient.useQuery('get', `/api/assignments/task/{taskId}`, {
    params: {
      path: {
        taskId,
      },
    },
  })
}
