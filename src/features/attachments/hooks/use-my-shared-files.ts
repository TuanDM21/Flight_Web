import $queryClient from '@/api'

export const useMySharedFiles = () => {
  return $queryClient.useQuery('get', '/api/attachments/my-shared-files')
}
