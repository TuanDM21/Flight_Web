import { z } from 'zod'

// Form schema with separate Date objects for date and time pickers
export const createFlightFormSchema = z.object({
  flightNumber: z.string().min(1, 'Số hiệu chuyến bay là bắt buộc'),
  departureAirportId: z
    .number({ required_error: 'Sân bay đi là bắt buộc' })
    .min(1, 'Sân bay đi là bắt buộc'),
  arrivalAirportId: z
    .number({ required_error: 'Sân bay đến là bắt buộc' })
    .min(1, 'Sân bay đến là bắt buộc'),
  flightDate: z.date({
    required_error: 'Ngày bay là bắt buộc',
  }),
  departureTime: z.string({
    required_error: 'Giờ khởi hành là bắt buộc',
  }),
  arrivalTime: z.string({ required_error: 'Giờ đến là bắt buộc' }),
  arrivalTimeatArrival: z.string().optional(),
  status: z.string().optional(),
  airline: z.string().min(1, 'Hãng bay là bắt buộc'),
  checkInCounters: z.string().optional(),
  gate: z.number().min(0).optional(),
  note: z.string().optional(),
})
