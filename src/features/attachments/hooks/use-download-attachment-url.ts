import $queryClient from '@/api'

export const getDownloadUrlQueryOptions = (attachmentId: number) =>
  $queryClient.queryOptions(
    'get',
    '/api/attachments/download-url/{attachmentId}',
    {
      params: {
        path: {
          attachmentId,
        },
      },
    },
    {
      staleTime: 5 * 60 * 1000,
    }
  )

export function useDownloadAttachmentUrl({
  attachmentId,
  enabled = true,
}: {
  attachmentId: number
  enabled?: boolean
}) {
  return $queryClient.useQuery(
    'get',
    '/api/attachments/download-url/{attachmentId}',
    {
      params: {
        path: {
          attachmentId,
        },
      },
    },
    {
      enabled: enabled,
    }
  )
}
