import $queryClient from '@/api'

export const getMyAttachmentsQueryOptions = () =>
  $queryClient.queryOptions('get', '/api/attachments/my-files')

export const useMyAttachments = () =>
  $queryClient.useQuery('get', '/api/attachments/my-files', {})
