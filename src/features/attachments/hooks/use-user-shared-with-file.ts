import $queryClient from '@/api'

export const getUsersSharedWithFileQueryOptions = (attachmentId: number) => {
  return $queryClient.queryOptions(
    'get',
    '/api/attachments/{attachmentId}/shares',
    {
      params: {
        path: {
          attachmentId: attachmentId,
        },
      },
    }
  )
}

export const useUsersSharedWithFile = (attachmentId: number) => {
  return $queryClient.useQuery(
    'get',
    '/api/attachments/{attachmentId}/shares',
    {
      params: {
        path: {
          attachmentId: attachmentId,
        },
      },
    }
  )
}
