import { toast } from 'sonner'
import { useDialogs } from '@/hooks/use-dialogs'
import { Flight } from '../types'
import { useDeleteFlight } from './use-delete-flight'

export const useFlightDeleteConfirm = () => {
  const dialogs = useDialogs()
  const deleteFlightMutation = useDeleteFlight()

  const onDeleteFlight = async (flight: Flight) => {
    const confirmed = await dialogs.confirm(
      <div className='space-y-2'>
        <p className='text-muted-foreground text-sm'>
          Bạn có chắc chắn muốn xóa chuyến bay{' '}
          <span className='font-medium'>{flight.flightNumber}</span>?
        </p>
        <div className='bg-muted rounded-md p-3'>
          <div className='grid grid-cols-2 gap-2 text-sm'>
            <div>
              <span className='text-muted-foreground'>Hãng bay:</span>{' '}
              <span className='font-medium'>{flight.airline || 'N/A'}</span>
            </div>
            <div>
              <span className='text-muted-foreground'>Ngày bay:</span>{' '}
              <span className='font-medium'>{flight.flightDate || 'N/A'}</span>
            </div>
            <div>
              <span className='text-muted-foreground'>Sân bay đi:</span>{' '}
              <span className='font-medium'>
                {flight.departureAirport?.airportCode || 'N/A'}
              </span>
            </div>
            <div>
              <span className='text-muted-foreground'>Sân bay đến:</span>{' '}
              <span className='font-medium'>
                {flight.arrivalAirport?.airportCode || 'N/A'}
              </span>
            </div>
          </div>
        </div>
        <p className='text-destructive text-sm font-medium'>
          Hành động này không thể hoàn tác.
        </p>
      </div>,
      {
        title: `Xóa chuyến bay ${flight.flightNumber}`,
        severity: 'error',
        okText: 'Xóa',
        cancelText: 'Hủy',
      }
    )

    if (confirmed) {
      const deleteFlightPromise = deleteFlightMutation.mutateAsync({
        params: {
          path: { id: flight.id! },
        },
      })

      toast.promise(deleteFlightPromise, {
        loading: `Đang xóa chuyến bay ${flight.flightNumber}...`,
        success: () => {
          return `Đã xóa thành công chuyến bay ${flight.flightNumber}.`
        },
        error: `Không thể xóa chuyến bay ${flight.flightNumber}. Vui lòng thử lại.`,
      })
    }
  }

  const onDeleteFlights = async (flights: Flight[]) => {
    if (flights.length === 0) return

    const flightNumbers = flights
      .map((flight) => flight.flightNumber)
      .filter(Boolean)
      .join(', ')

    const confirmed = await dialogs.confirm(
      <div className='space-y-2'>
        <p className='text-muted-foreground text-sm'>
          Bạn có chắc chắn muốn xóa{' '}
          <span className='font-medium'>{flights.length} chuyến bay</span>?
        </p>
        <div className='bg-muted rounded-md p-3'>
          <p className='text-sm font-medium'>Danh sách chuyến bay:</p>
          <p className='text-muted-foreground text-sm'>{flightNumbers}</p>
        </div>
        <p className='text-destructive text-sm font-medium'>
          Hành động này không thể hoàn tác.
        </p>
      </div>,
      {
        title: `Xóa ${flights.length} chuyến bay`,
        severity: 'error',
        okText: 'Xóa tất cả',
        cancelText: 'Hủy',
      }
    )

    if (confirmed) {
      const deletePromises = flights.map(async (flight) => {
        if (flight.id) {
          return deleteFlightMutation.mutateAsync({
            params: { path: { id: flight.id } },
          })
        }
      })

      const bulkDeletePromise = Promise.all(deletePromises)

      toast.promise(bulkDeletePromise, {
        loading: `Đang xóa ${flights.length} chuyến bay...`,
        success: () => {
          return `Đã xóa thành công ${flights.length} chuyến bay.`
        },
        error: `Không thể xóa một số chuyến bay. Vui lòng thử lại.`,
      })

      return bulkDeletePromise
    }
  }

  return {
    onDeleteFlight,
    onDeleteFlights,
    isDeleting: deleteFlightMutation.isPending,
  }
}
