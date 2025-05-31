import $queryClient from '@/api'

export const getMyAttachmentsQueryOptions = () =>
  $queryClient.queryOptions('get', '/api/attachments/my-files')

export const useViewAttachments = () =>
  $queryClient.useQuery('get', '/api/attachments/my-files', {})
