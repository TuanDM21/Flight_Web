import $queryClient from '@/api'

export const useConfirmUpload = () => {
  return $queryClient.useMutation('post', '/api/attachments/confirm-upload')
}
