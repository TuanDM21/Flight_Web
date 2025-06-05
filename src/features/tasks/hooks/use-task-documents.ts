import $queryClient from '@/api'

export const getTaskDocumentsQueryOptions = (taskId: number) =>
  $queryClient.queryOptions('get', `/api/task-documents`, {
    params: {
      query: {
        taskId,
      },
    },
  })

export const useViewTaskDocuments = (taskId: number) => {
  return $queryClient.useQuery('get', `/api/task-documents`, {
    params: {
      query: {
        taskId,
      },
    },
  })
}
