import $queryClient from '@/api'

export const useGenerateUploadUrls = () => {
  return $queryClient.useMutation(
    'post',
    '/api/attachments/generate-upload-urls'
  )
}
