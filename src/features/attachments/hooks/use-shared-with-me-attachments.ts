import $queryClient from '@/api'

export const sharedWithMeAttachmentsQueryOptions = () =>
  $queryClient.queryOptions('get', '/api/attachments/shared-with-me')

export const useSharedWithMeAttachments = () => {
  return $queryClient.useQuery('get', '/api/attachments/shared-with-me')
}
