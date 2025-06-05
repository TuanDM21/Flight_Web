import $queryClient from '@/api'

export const useTaskAssignmentComments = (assignmentId: number) => {
  return $queryClient.useQuery('get', '/api/assignments/{id}/comments', {
    params: {
      path: {
        id: assignmentId,
      },
    },
  })
}
