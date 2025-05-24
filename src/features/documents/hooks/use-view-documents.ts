import $queryClient from '@/api'

export const useViewDocuments = () =>
  $queryClient.useQuery('get', '/api/documents', {})
