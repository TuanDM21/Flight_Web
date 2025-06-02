import $queryClient from '@/api'

export const myAccessibleAttachmentsQueryOptions = () =>
  $queryClient.queryOptions('get', '/api/attachments/accessible-files')

export const useMyAccessibleAttachments = () =>
  $queryClient.useQuery('get', '/api/attachments/accessible-files', {})
