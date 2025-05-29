import $queryClient from '@/api'

export const useAssignAttachmentsToDocument = () => {
  return $queryClient.useMutation(
    'post',
    '/api/documents/{documentId}/attachments/assign'
  )
}
