import { FlightStatus } from './types'

export const FLIGHT_STATUS = {
  SCHEDULED: 'SCHEDULED',
  BOARDING: 'BOARDING',
  GATE_CLOSED: 'GATE_CLOSED',
  DELAYED: 'DELAYED',
  IN_AIR: 'IN_AIR',
  LANDED: 'LANDED',
  CANCELLED: 'CANCELLED',
  DIVERTED: 'DIVERTED',
  ARRIVED: 'ARRIVED',
} as const

export const flightStatusLabels: Record<FlightStatus, string> = {
  [FLIGHT_STATUS.SCHEDULED]: 'Đã lên lịch',
  [FLIGHT_STATUS.BOARDING]: 'Đang lên máy bay',
  [FLIGHT_STATUS.GATE_CLOSED]: 'Đã đóng cửa',
  [FLIGHT_STATUS.DELAYED]: 'Trễ chuyến',
  [FLIGHT_STATUS.IN_AIR]: 'Đang bay',
  [FLIGHT_STATUS.LANDED]: 'Đã hạ cánh',
  [FLIGHT_STATUS.CANCELLED]: 'Hủy chuyến',
  [FLIGHT_STATUS.DIVERTED]: 'Chuyển hướng',
  [FLIGHT_STATUS.ARRIVED]: 'Đã đến',
}

export const flightStatusVariants: Record<FlightStatus, string> = {
  [FLIGHT_STATUS.SCHEDULED]: 'secondary',
  [FLIGHT_STATUS.BOARDING]: 'in-progress',
  [FLIGHT_STATUS.GATE_CLOSED]: 'outline',
  [FLIGHT_STATUS.DELAYED]: 'destructive',
  [FLIGHT_STATUS.IN_AIR]: 'in-progress',
  [FLIGHT_STATUS.LANDED]: 'completed',
  [FLIGHT_STATUS.CANCELLED]: 'cancelled',
  [FLIGHT_STATUS.DIVERTED]: 'destructive',
  [FLIGHT_STATUS.ARRIVED]: 'completed',
}
