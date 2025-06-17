import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { BaseApiResponse } from '@/types/response'
import { flightKeysFactory } from '@/api/query-key-factory'
import type { Flight } from '../types'

interface OptimisticDeleteFlightContext {
  previousFlightsList?: BaseApiResponse<Flight[]>
  deletedFlightId: number
  deletedFlight?: Flight
}

export function useDeleteFlight() {
  const queryClient = useQueryClient()

  return $queryClient.useMutation('delete', '/api/flights/{id}', {
    onMutate: async (variables): Promise<OptimisticDeleteFlightContext> => {
      // Get the flight ID from the variables
      const flightId = variables?.params?.path?.id

      if (!flightId) {
        return { deletedFlightId: 0 }
      }

      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: flightKeysFactory.lists() })

      // Snapshot the previous value
      const previousFlightsList = queryClient.getQueryData<
        BaseApiResponse<Flight[]>
      >(flightKeysFactory.lists())

      // Find the flight being deleted for potential rollback
      const deletedFlight = previousFlightsList?.data?.find(
        (flight) => flight.id === Number(flightId)
      )

      // Optimistically remove the flight from the list
      queryClient.setQueryData(
        flightKeysFactory.lists(),
        (old: BaseApiResponse<Flight[]> | undefined) => {
          if (!old?.data) return old

          return {
            ...old,
            data: old.data.filter((flight) => flight.id !== Number(flightId)),
          }
        }
      )

      // Return context for error handling
      return {
        previousFlightsList,
        deletedFlightId: Number(flightId),
        deletedFlight,
      }
    },
    onError: (_error, _variables, context) => {
      const typedContext = context as OptimisticDeleteFlightContext | undefined
      if (!typedContext) return

      // If the mutation fails, use the context to roll back
      if (typedContext.previousFlightsList) {
        queryClient.setQueryData(
          flightKeysFactory.lists(),
          typedContext.previousFlightsList
        )
      }
    },
    onSuccess: (_data, _variables, _context) => {
      // Invalidate and refetch flights list to get the real data
      queryClient.invalidateQueries({ queryKey: flightKeysFactory.lists() })

      // Optionally invalidate other related queries
      queryClient.invalidateQueries({ queryKey: flightKeysFactory.today() })
    },
    onSettled: (_data, _error, _variables, _context) => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: flightKeysFactory.lists() })
      queryClient.invalidateQueries({ queryKey: flightKeysFactory.today() })
    },
  })
}
