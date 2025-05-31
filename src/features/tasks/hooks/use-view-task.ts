import $queryClient from '@/api'

export const getTaskListQueryOptions = () =>
  $queryClient.queryOptions('get', '/api/tasks')
