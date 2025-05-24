import $queryClient from '@/api'

export const useViewTaskAssignmentComments = (assignmentId: number) => {
  return $queryClient.useQuery('get', '/api/assignments/{id}/comments', {
    params: {
      path: {
        id: assignmentId,
      },
    },
  })
}
