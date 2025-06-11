import $queryClient from '@/api'

export const getAttachmentDetailQueryOptions = (attachmentId: number) =>
  $queryClient.queryOptions('get', '/api/attachments/{id}', {
    params: {
      path: {
        id: attachmentId,
      },
    },
  })

export const useAttachmentDetail = (attachmentId: number) =>
  $queryClient.useQuery('get', '/api/attachments/{id}', {
    params: {
      path: {
        id: attachmentId,
      },
    },
  })
