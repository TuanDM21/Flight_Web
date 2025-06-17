import { LocalTime } from '../types'

/**
 * Format time from string or LocalTime object to HH:mm format
 */
export function formatTimeString(time?: string | LocalTime): string {
  if (!time) return 'N/A'

  // If it's a string format (HH:mm:ss)
  if (typeof time === 'string') {
    return time.slice(0, 5) // Remove seconds, keep HH:mm
  }

  // If it's a LocalTime object
  if (
    typeof time === 'object' &&
    time.hour !== undefined &&
    time.minute !== undefined
  ) {
    return `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`
  }

  return 'N/A'
}

/**
 * Calculate flight duration in minutes between two times
 */
export function calculateFlightDuration(
  departureTime: string | LocalTime,
  arrivalTime: string | LocalTime
): number | null {
  const depTimeStr = formatTimeString(departureTime)
  const arrTimeStr = formatTimeString(arrivalTime)

  if (depTimeStr === 'N/A' || arrTimeStr === 'N/A') return null

  const [depHour, depMin] = depTimeStr.split(':').map(Number)
  const [arrHour, arrMin] = arrTimeStr.split(':').map(Number)

  let totalMinutes = arrHour * 60 + arrMin - (depHour * 60 + depMin)

  // If negative, assume next day arrival
  if (totalMinutes < 0) {
    totalMinutes += 24 * 60
  }

  return totalMinutes
}

/**
 * Format flight duration from minutes to "Xh Ym" format
 */
export function formatFlightDuration(durationMinutes: number | null): string {
  if (durationMinutes === null) return 'N/A'

  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60

  return `${hours}h ${minutes}m`
}

/**
 * Check if a flight time is delayed by comparing actual vs scheduled time
 */
export function isTimeDelayed(
  actualTime?: string | LocalTime,
  scheduledTime?: string | LocalTime
): boolean {
  if (!actualTime || !scheduledTime) return false

  const actualTimeStr = formatTimeString(actualTime)
  const scheduledTimeStr = formatTimeString(scheduledTime)

  if (actualTimeStr === 'N/A' || scheduledTimeStr === 'N/A') return false
  return actualTimeStr > scheduledTimeStr
}

/**
 * Get estimated arrival date based on flight date and times
 * Returns the next day if arrival time is earlier than departure time
 */
export function getEstimatedArrivalDate(
  flightDate?: string,
  departureTime?: string | LocalTime,
  arrivalTime?: string | LocalTime
): string | undefined {
  if (!flightDate || !departureTime || !arrivalTime) {
    return flightDate
  }

  const flightDateObj = new Date(flightDate)
  const departureTimeStr = formatTimeString(departureTime)
  const arrivalTimeStr = formatTimeString(arrivalTime)

  if (departureTimeStr === 'N/A' || arrivalTimeStr === 'N/A') {
    return flightDate
  }

  // If arrival time is earlier than departure time, assume next day
  if (arrivalTimeStr < departureTimeStr) {
    const nextDay = new Date(flightDateObj)
    nextDay.setDate(nextDay.getDate() + 1)
    return nextDay.toISOString().split('T')[0]
  }

  return flightDate
}
