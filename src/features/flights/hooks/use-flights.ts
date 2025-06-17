import $queryClient from '@/api'

export const flightsQueryOptions = () =>
  $queryClient.queryOptions('get', '/api/flights')

export const useFlights = () => $queryClient.useQuery('get', '/api/flights')
