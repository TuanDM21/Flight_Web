import { format } from 'date-fns'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { FlightDetailRoute } from '@/routes/_authenticated/flights/$flight-id/index'
import { vi } from 'date-fns/locale'
import {
  ArrowRight,
  Building2,
  Clock,
  Edit,
  Hash,
  MapPin,
  Plane,
  Trash2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { FlightStatusBadge } from './components/flight-status-badge'
import { useFlightDeleteConfirm } from './hooks/use-flight-delete-confirm'
import { getFlightDetailQueryOptions } from './hooks/use-flight-detail'
import { Flight, FlightStatus } from './types'
import {
  formatTimeString,
  formatFlightDuration,
  calculateFlightDuration,
  isTimeDelayed,
  getEstimatedArrivalDate,
} from './utils/time-format'

export default function FlightDetailPage() {
  const flightId = FlightDetailRoute.useParams()['flight-id']
  const { data: flightDetailsQuery } = useSuspenseQuery(
    getFlightDetailQueryOptions(Number(flightId))
  )
  const { onDeleteFlight, isDeleting } = useFlightDeleteConfirm()

  const flight: Flight = flightDetailsQuery?.data || {}

  const handleDelete = async () => {
    await onDeleteFlight(flight)
  }

  // Use utils for formatting
  const estimatedArrivalDate = getEstimatedArrivalDate(
    flight.flightDate,
    flight.departureTime,
    flight.arrivalTime
  )

  const departureTime = formatTimeString(flight.departureTime)
  const arrivalTime = formatTimeString(flight.arrivalTime)
  const actualDepartureTime = formatTimeString(flight.actualDepartureTime)
  const actualArrivalTime = formatTimeString(flight.actualArrivalTime)

  // Check if flight is delayed
  const isDepartureDelayed = isTimeDelayed(
    flight.actualDepartureTime,
    flight.departureTime
  )
  const isArrivalDelayed = isTimeDelayed(
    flight.actualArrivalTime,
    flight.arrivalTime
  )

  // Calculate flight duration
  const flightDuration =
    flight.departureTime && flight.arrivalTime
      ? calculateFlightDuration(flight.departureTime, flight.arrivalTime)
      : null
  const formattedDuration = formatFlightDuration(flightDuration)

  return (
    <div className='container mx-auto space-y-6 p-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <div className='flex items-center gap-3'>
            <Plane className='h-6 w-6 text-blue-600' />
            <h1 className='text-3xl font-bold'>
              Chuyến bay {flight.flightNumber}
            </h1>
            <FlightStatusBadge status={flight.status as FlightStatus} />
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <Button variant='outline' asChild>
            <Link
              to='/flights/$flight-id/edit'
              params={{ 'flight-id': String(flight.id) }}
            >
              <Edit className='mr-2 h-4 w-4' />
              Chỉnh sửa
            </Link>
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className='mr-2 h-4 w-4' />
            Xóa
          </Button>
        </div>
      </div>

      <Separator />

      {/* Flight Route */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <MapPin className='h-5 w-5' />
            Tuyến bay
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between'>
            <div className='text-center'>
              <div className='text-2xl font-bold'>
                {flight.departureAirport?.airportCode || 'N/A'}
              </div>
              <div className='text-muted-foreground text-sm'>
                {flight.departureAirport?.airportName || 'Không xác định'}
              </div>
              <div className='text-muted-foreground text-xs'>
                {flight.departureAirport?.city || ''}
              </div>
            </div>

            <div className='flex flex-col items-center'>
              <ArrowRight className='h-6 w-6 text-blue-600' />
              <div className='text-muted-foreground mt-1 text-xs'>
                {flight.airline || 'N/A'}
              </div>
              {/* Flight duration */}
              {departureTime !== 'N/A' && arrivalTime !== 'N/A' && (
                <div className='text-muted-foreground mt-1 text-xs'>
                  {formattedDuration}
                </div>
              )}
            </div>

            <div className='text-center'>
              <div className='text-2xl font-bold'>
                {flight.arrivalAirport?.airportCode || 'N/A'}
              </div>
              <div className='text-muted-foreground text-sm'>
                {flight.arrivalAirport?.airportName || 'Không xác định'}
              </div>
              <div className='text-muted-foreground text-xs'>
                {flight.arrivalAirport?.city || ''}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flight Times */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Departure */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Clock className='h-5 w-5 text-green-600' />
              Khởi hành
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <div className='text-muted-foreground text-sm'>Ngày bay</div>
              <div className='text-lg font-semibold'>
                {flight.flightDate
                  ? format(new Date(flight.flightDate), 'dd/MM/yyyy', {
                      locale: vi,
                    })
                  : 'N/A'}
              </div>
            </div>

            <div>
              <div className='text-muted-foreground text-sm'>Giờ dự kiến</div>
              <div className='font-mono text-2xl font-bold'>
                {departureTime}
              </div>
            </div>

            {actualDepartureTime !== 'N/A' && (
              <div>
                <div className='text-muted-foreground text-sm'>Giờ thực tế</div>
                <div className='flex items-center gap-2'>
                  <div className='font-mono text-2xl font-bold'>
                    {actualDepartureTime}
                  </div>
                  {isDepartureDelayed && (
                    <Badge variant='destructive' className='text-xs'>
                      Trễ
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {flight.actualDepartureTimeAtArrival && (
              <div>
                <div className='text-muted-foreground text-sm'>
                  Khởi hành thực tế tại điểm đến
                </div>
                <div className='font-mono text-lg font-semibold'>
                  {formatTimeString(flight.actualDepartureTimeAtArrival)}
                </div>
              </div>
            )}

            {flight.gate && (
              <div>
                <div className='text-muted-foreground text-sm'>Cổng</div>
                <div className='text-lg font-semibold'>{flight.gate}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Arrival */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Clock className='h-5 w-5 text-blue-600' />
              Đến nơi
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <div className='text-muted-foreground text-sm'>
                Ngày đến dự kiến
              </div>
              <div className='text-lg font-semibold'>
                {estimatedArrivalDate
                  ? format(new Date(estimatedArrivalDate), 'dd/MM/yyyy', {
                      locale: vi,
                    })
                  : 'N/A'}
              </div>
            </div>

            <div>
              <div className='text-muted-foreground text-sm'>Giờ dự kiến</div>
              <div className='font-mono text-2xl font-bold'>{arrivalTime}</div>
            </div>

            {actualArrivalTime !== 'N/A' && (
              <div>
                <div className='text-muted-foreground text-sm'>Giờ thực tế</div>
                <div className='flex items-center gap-2'>
                  <div className='font-mono text-2xl font-bold'>
                    {actualArrivalTime}
                  </div>
                  {isArrivalDelayed && (
                    <Badge variant='destructive' className='text-xs'>
                      Trễ
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {flight.arrivalTimeatArrival && (
              <div>
                <div className='text-muted-foreground text-sm'>
                  Thời gian đến tại điểm đến
                </div>
                <div className='font-mono text-lg font-semibold'>
                  {formatTimeString(flight.arrivalTimeatArrival)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Flight Details */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Hash className='h-5 w-5' />
              Thông tin cơ bản
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <div className='text-muted-foreground text-sm'>Ngày bay</div>
                <div className='font-semibold'>
                  {flight.flightDate
                    ? format(new Date(flight.flightDate), 'dd/MM/yyyy', {
                        locale: vi,
                      })
                    : 'N/A'}
                </div>
              </div>

              <div>
                <div className='text-muted-foreground text-sm'>Hãng bay</div>
                <div className='font-semibold'>{flight.airline || 'N/A'}</div>
              </div>

              {flight.checkInCounters && (
                <div>
                  <div className='text-muted-foreground text-sm'>
                    Quầy check-in
                  </div>
                  <div className='font-semibold'>{flight.checkInCounters}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Building2 className='h-5 w-5' />
              Thông tin bổ sung
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <div className='text-muted-foreground text-sm'>Trạng thái</div>
              {flight.status ? (
                <FlightStatusBadge status={flight.status as FlightStatus} />
              ) : (
                <Badge variant='secondary'>Chưa xác định</Badge>
              )}
            </div>

            <div>
              <div className='text-muted-foreground text-sm'>Ngày tạo</div>
              <div className='font-semibold'>
                {flight.createdAt
                  ? format(new Date(flight.createdAt), 'dd/MM/yyyy HH:mm', {
                      locale: vi,
                    })
                  : 'N/A'}
              </div>
            </div>

            <div>
              <div className='text-muted-foreground text-sm'>
                Cập nhật lần cuối
              </div>
              <div className='font-semibold'>
                {flight.updatedAt
                  ? format(new Date(flight.updatedAt), 'dd/MM/yyyy HH:mm', {
                      locale: vi,
                    })
                  : 'N/A'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {flight.note && (
        <Card>
          <CardHeader>
            <CardTitle>Ghi chú</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground whitespace-pre-wrap'>
              {flight.note}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Back Button */}
      <div className='flex justify-center pt-6'>
        <Button variant='outline' asChild>
          <Link to='/flights'>Quay lại danh sách chuyến bay</Link>
        </Button>
      </div>
    </div>
  )
}
