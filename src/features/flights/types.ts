import { z } from 'zod'
import { components } from '@/generated/api-schema'
import { FLIGHT_STATUS } from './constants'
import { createFlightFormSchema } from './schema'

export type Flight = components['schemas']['FlightDTO']
export type LocalTime = components['schemas']['LocalTime']
export type Airport = components['schemas']['AirportDTO']

export type CreateFlightFormData = z.infer<typeof createFlightFormSchema>

export type FlightStatus = (typeof FLIGHT_STATUS)[keyof typeof FLIGHT_STATUS]

export type FlightFilters =
  | 'airline'
  | 'flightNumber'
  | 'status'
  | 'departureAirport'
  | 'arrivalAirport'
