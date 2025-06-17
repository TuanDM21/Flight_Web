import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { BaseApiResponse } from '@/types/response'
import { flightKeysFactory } from '@/api/query-key-factory'
import { FLIGHT_STATUS } from '../constants'
import type { Flight } from '../types'

interface OptimisticCreateFlightContext {
  previousFlightsList?: BaseApiResponse<Flight[]>
  optimisticFlightId: number
}

export function useCreateFlight() {
  const queryClient = useQueryClient()

  return $queryClient.useMutation('post', '/api/flights', {
    onMutate: async (variables): Promise<OptimisticCreateFlightContext> => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: flightKeysFactory.lists() })

      // Snapshot the previous value
      const previousFlightsList = queryClient.getQueryData<
        BaseApiResponse<Flight[]>
      >(flightKeysFactory.lists())

      // Generate optimistic ID
      const optimisticFlightId = Date.now()

      // Extract the flight data from variables
      const flightData = variables?.body

      if (!flightData) {
        return { previousFlightsList, optimisticFlightId }
      }

      // Optimistically update the flights list
      queryClient.setQueryData(
        flightKeysFactory.lists(),
        (old: BaseApiResponse<Flight[]> | undefined) => {
          if (!old?.data) return old

          // Create optimistic flight with temporary ID
          const optimisticFlight: Flight = {
            id: optimisticFlightId,
            flightNumber: flightData.flightNumber,
            airline: flightData.airline,
            departureAirport: undefined, // Will be populated after real response
            arrivalAirport: undefined, // Will be populated after real response
            flightDate: flightData.flightDate,
            departureTime: undefined, // Will be populated after real response
            arrivalTime: undefined, // Will be populated after real response
            status: flightData.status || FLIGHT_STATUS.SCHEDULED,
            gate: flightData.gate,
            checkInCounters: flightData.checkInCounters,
            note: flightData.note,
            arrivalTimeatArrival: undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          return {
            ...old,
            data: [optimisticFlight, ...old.data],
          }
        }
      )

      // Return context for error handling
      return {
        previousFlightsList,
        optimisticFlightId,
      }
    },
    onError: (_error, _variables, context) => {
      const typedContext = context as OptimisticCreateFlightContext | undefined
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
