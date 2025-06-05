import $queryClient from '@/api'

export const getDocumentListQueryOptions = () =>
  $queryClient.queryOptions('get', '/api/documents')

export const useDocuments = () =>
  $queryClient.useQuery('get', '/api/documents', {})
