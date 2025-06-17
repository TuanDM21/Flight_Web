import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { BaseApiResponse } from '@/types/response'
import { flightKeysFactory } from '@/api/query-key-factory'
import { Flight } from '../types'

interface OptimisticUpdateContext {
  previousFlight: BaseApiResponse<Flight> | undefined
}

export const useUpdateFlight = () => {
  const queryClient = useQueryClient()

  return $queryClient.useMutation('put', '/api/flights/{id}', {
    onMutate: async (variables) => {
      const flightId = variables?.params?.path?.id

      const numericFlightId = Number(flightId)

      // Cancel any outgoing refetches to prevent them overwriting our optimistic update
      await queryClient.cancelQueries({
        queryKey: flightKeysFactory.detail(numericFlightId),
      })
      await queryClient.cancelQueries({
        queryKey: flightKeysFactory.lists(),
      })

      // Snapshot the previous values
      const previousFlight = queryClient.getQueryData<BaseApiResponse<Flight>>(
        flightKeysFactory.detail(numericFlightId)
      )

      return { previousFlight }
    },
    onError: (_, variables, context) => {
      const typedContext = context as OptimisticUpdateContext | undefined
      const flightId = variables?.params?.path?.id

      if (!typedContext) return

      const numericFlightId = Number(flightId)

      // Restore the previous flight detail if available
      if (typedContext.previousFlight) {
        queryClient.setQueryData(
          flightKeysFactory.detail(numericFlightId),
          typedContext.previousFlight
        )
      }
    },
    onSettled: (_, __, variables) => {
      const flightId = variables?.params?.path?.id

      const numericFlightId = Number(flightId)

      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({
        queryKey: flightKeysFactory.detail(numericFlightId),
      })
      queryClient.invalidateQueries({
        queryKey: flightKeysFactory.lists(),
      })
    },
  })
}
