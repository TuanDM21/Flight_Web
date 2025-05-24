import $queryClient from '@/api'

export const useUploadAttachments = () => {
  return $queryClient.useMutation('post', '/api/attachments/upload-multi', {})
}
