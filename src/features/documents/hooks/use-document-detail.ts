import $queryClient from '@/api'

export const getDocumentDetailQueryOptions = (documentId: number) =>
  $queryClient.queryOptions('get', '/api/documents/{id}', {
    params: {
      path: {
        id: documentId,
      },
    },
  })

export const useDocumentDetail = (documentId: number) => {
  return $queryClient.useQuery('get', '/api/documents/{id}', {
    params: {
      path: {
        id: documentId,
      },
    },
  })
}
