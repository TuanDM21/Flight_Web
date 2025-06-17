import $queryClient from '@/api'

export const getFlightDetailQueryOptions = (flightId: number) =>
  $queryClient.queryOptions('get', '/api/flights/{id}', {
    params: { path: { id: flightId } },
  })

export const useFlightDetail = (flightId: number) =>
  $queryClient.useQuery('get', '/api/flights/{id}', {
    params: { path: { id: flightId } },
  })
