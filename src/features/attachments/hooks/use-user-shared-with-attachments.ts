import { useSuspenseQuery } from '@tanstack/react-query'
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

export const useSuspenseUsersSharedWithFile = (attachmentId: number) => {
  return useSuspenseQuery(getUsersSharedWithFileQueryOptions(attachmentId))
}
