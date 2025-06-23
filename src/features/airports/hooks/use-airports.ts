import $queryClient from '@/api'

export const airportsQueryOptions = () =>
  $queryClient.queryOptions('get', '/api/airports')

export const useAirports = () => $queryClient.useQuery('get', '/api/airports')
