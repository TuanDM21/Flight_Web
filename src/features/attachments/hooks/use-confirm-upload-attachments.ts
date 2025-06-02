import $queryClient from '@/api'

export const useConfirmUploadAttachments = () => {
  return $queryClient.useMutation('post', '/api/attachments/confirm-upload')
}
