import { z } from 'zod'
import { filterItemSchema, sortingItemSchema } from '@/lib/parsers'
import { LocalTime, Airport } from '../types'

export const flightSearchParamsCache = z.object({
  filters: z.array(filterItemSchema).default([]),
  sort: z.array(sortingItemSchema).default([{ id: 'createdAt', desc: true }]),
})

// Helper function to format airport information
export function formatAirport(airport?: Airport): string {
  if (!airport) return 'N/A'
  return `${airport.airportCode || ''} - ${airport.airportName || ''}`
}

// Helper function to get short airport code
export function getAirportCode(airport?: Airport): string {
  return airport?.airportCode || 'N/A'
}

// Helper function to get full airport name
export function getAirportName(airport?: Airport): string {
  return airport?.airportName || 'N/A'
}

// Helper function to check if flight is delayed
export function isFlightDelayed(
  actualTime?: LocalTime,
  scheduledTime?: LocalTime
): boolean {
  if (!actualTime || !scheduledTime) return false

  const actualMinutes = (actualTime.hour || 0) * 60 + (actualTime.minute || 0)
  const scheduledMinutes =
    (scheduledTime.hour || 0) * 60 + (scheduledTime.minute || 0)

  return actualMinutes > scheduledMinutes
}

// Helper function to calculate delay in minutes
export function getDelayMinutes(
  actualTime?: LocalTime,
  scheduledTime?: LocalTime
): number {
  if (!actualTime || !scheduledTime) return 0

  const actualMinutes = (actualTime.hour || 0) * 60 + (actualTime.minute || 0)
  const scheduledMinutes =
    (scheduledTime.hour || 0) * 60 + (scheduledTime.minute || 0)

  return Math.max(0, actualMinutes - scheduledMinutes)
}

// Helper function to get flight status based on times
export function getFlightStatus(
  actualDepartureTime?: LocalTime,
  actualArrivalTime?: LocalTime,
  scheduledDepartureTime?: LocalTime
): 'scheduled' | 'departed' | 'arrived' | 'delayed' | 'cancelled' {
  if (actualArrivalTime) return 'arrived'
  if (actualDepartureTime) {
    if (isFlightDelayed(actualDepartureTime, scheduledDepartureTime)) {
      return 'delayed'
    }
    return 'departed'
  }
  if (
    scheduledDepartureTime &&
    isFlightDelayed(actualDepartureTime, scheduledDepartureTime)
  ) {
    return 'delayed'
  }
  return 'scheduled'
}
