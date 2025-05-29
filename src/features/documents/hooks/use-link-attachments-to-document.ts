import $queryClient from '@/api'

export const useLinkAttachmentsToDocument = () => {
  return $queryClient.useMutation(
    'post',
    '/api/documents/{documentId}/attachments/assign'
  )
}
