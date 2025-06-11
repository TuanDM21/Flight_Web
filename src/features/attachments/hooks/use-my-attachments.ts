import $queryClient from '@/api'

export const myAttachmentsQueryOptions = () =>
  $queryClient.queryOptions('get', '/api/attachments/my-files')

export const useMyAttachments = () =>
  $queryClient.useQuery('get', '/api/attachments/my-files', {})
