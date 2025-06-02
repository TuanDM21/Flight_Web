import $queryClient from '@/api'

export const useSharedWithMeFiles = () => {
  return $queryClient.useQuery('get', '/api/attachments/shared-with-me')
}
