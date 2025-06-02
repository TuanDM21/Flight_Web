import $queryClient from '@/api'

export const useMySharedAttachments = () => {
  return $queryClient.useQuery('get', '/api/attachments/my-shared-files')
}
