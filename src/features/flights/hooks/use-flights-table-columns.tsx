import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { dateFormatPatterns } from '@/config/date'
import {
  ArrowRight,
  Calendar,
  Clock,
  Hash,
  MapPin,
  Plane,
  StickyNote,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { FlightRowActions } from '../components/flight-row-actions'
import { FlightStatusBadge } from '../components/flight-status-badge'
import { flightStatusLabels } from '../constants'
import { Flight, FlightStatus } from '../types'
import { formatAirport, isFlightDelayed } from '../utils/flights'
import { formatTimeString } from '../utils/time-format'

export function useFlightsTableColumns(): ColumnDef<Flight>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <div className='px-4 py-2'>
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value)
            }}
            aria-label='Select all'
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className='px-4 py-2'>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value)
            }}
            aria-label='Select row'
          />
        </div>
      ),
      size: 64,
      enableSorting: false,
      enableHiding: false,
      meta: {
        className: 'sticky left-0 bg-background border-r',
      },
    },
    {
      id: 'id',
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Mã chuyến bay' />
      ),
      cell: ({ cell }) => {
        const flightId = cell.getValue<number>()
        return (
          <Button variant='link' size='sm' asChild className='h-auto p-0'>
            <Link
              to='/flights/$flight-id'
              params={{ 'flight-id': String(flightId) }}
            >
              #{flightId ?? 'N/A'}
            </Link>
          </Button>
        )
      },
      meta: {
        label: 'Mã chuyến bay',
        placeholder: 'Tìm kiếm mã chuyến bay...',
        variant: 'text',
        icon: Hash,
      },
      enableColumnFilter: true,
    },
    {
      id: 'flightNumber',
      accessorKey: 'flightNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Số hiệu chuyến bay' />
      ),
      cell: ({ cell }) => {
        const flightNumber = cell.getValue<string>()
        return (
          <div className='flex items-center gap-2'>
            <Plane className='h-4 w-4 text-blue-600' />
            <span className='font-medium'>{flightNumber || 'N/A'}</span>
          </div>
        )
      },
      meta: {
        label: 'Số hiệu chuyến bay',
        placeholder: 'Tìm kiếm số hiệu...',
        variant: 'text',
        icon: Plane,
      },
      enableColumnFilter: true,
    },
    {
      id: 'route',
      accessorFn: (row) =>
        `${row.departureAirport?.airportCode} - ${row.arrivalAirport?.airportCode}`,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Tuyến bay' />
      ),
      cell: ({ row }) => {
        const departure = row.original.departureAirport
        const arrival = row.original.arrivalAirport

        return (
          <div className='flex min-w-0 items-center gap-2'>
            <div className='flex items-center gap-1 text-sm'>
              <span className='font-medium'>
                {departure?.airportCode || 'N/A'}
              </span>
              <ArrowRight className='text-muted-foreground h-3 w-3' />
              <span className='font-medium'>
                {arrival?.airportCode || 'N/A'}
              </span>
            </div>
          </div>
        )
      },
      meta: {
        label: 'Tuyến bay',
        placeholder: 'Tìm kiếm tuyến bay...',
        variant: 'text',
        icon: MapPin,
      },
      enableColumnFilter: true,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Trạng thái' />
      ),
      cell: ({ cell }) => {
        const status = cell.getValue<FlightStatus>()

        return (
          <div className='flex items-center justify-start'>
            {status ? (
              <FlightStatusBadge status={status} size='sm' />
            ) : (
              <span className='text-muted-foreground'>N/A</span>
            )}
          </div>
        )
      },
      meta: {
        label: 'Trạng thái',
        placeholder: 'Lọc theo trạng thái...',
        variant: 'select',
        icon: MapPin,
        options: Object.entries(flightStatusLabels).map(([value, label]) => ({
          label,
          value,
        })),
      },
      enableColumnFilter: true,
    },
    {
      id: 'departureAirport',
      accessorFn: (row) => formatAirport(row.departureAirport as any),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Sân bay đi' />
      ),
      cell: ({ row }) => {
        const airport = row.original.departureAirport
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className='cursor-pointer text-sm'>
                  <div className='font-medium'>
                    {airport?.airportCode || 'N/A'}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side='top' className='font-medium'>
                <p>{airport?.airportName || 'Không có thông tin'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
      meta: {
        label: 'Sân bay đi',
        placeholder: 'Tìm kiếm sân bay đi...',
        variant: 'text',
        icon: MapPin,
      },
      enableColumnFilter: true,
    },
    {
      id: 'arrivalAirport',
      accessorFn: (row) => formatAirport(row.arrivalAirport as any),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Sân bay đến' />
      ),
      cell: ({ row }) => {
        const airport = row.original.arrivalAirport
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className='cursor-pointer text-sm'>
                  <div className='font-medium'>
                    {airport?.airportCode || 'N/A'}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side='top' className='font-medium'>
                <p>{airport?.airportName || 'Không có thông tin'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
      meta: {
        label: 'Sân bay đến',
        placeholder: 'Tìm kiếm sân bay đến...',
        variant: 'text',
        icon: MapPin,
      },
      enableColumnFilter: true,
    },
    {
      id: 'flightDate',
      accessorKey: 'flightDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Ngày bay' />
      ),
      cell: ({ cell }) => {
        const value = cell.getValue<string>()
        if (!value) return <div>N/A</div>

        const date = new Date(value)
        return (
          <div className='flex items-center gap-2'>
            <Calendar className='text-muted-foreground h-4 w-4' />
            <span>{format(date, 'dd/MM/yyyy')}</span>
          </div>
        )
      },
      meta: {
        label: 'Ngày bay',
        placeholder: 'Lọc theo ngày bay...',
        variant: 'date',
        icon: Calendar,
      },
      enableColumnFilter: true,
    },
    {
      id: 'departureTime',
      accessorFn: (row) => formatTimeString(row.departureTime as any),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Giờ khởi hành' />
      ),
      cell: ({ row }) => {
        const time = formatTimeString(row.original.departureTime as any)
        return (
          <div className='flex items-center gap-2'>
            <Clock className='h-4 w-4 text-green-600' />
            <span className='font-mono'>{time}</span>
          </div>
        )
      },
      meta: {
        label: 'Giờ khởi hành',
        placeholder: 'Tìm kiếm giờ khởi hành...',
        variant: 'text',
        icon: Clock,
      },
    },
    {
      id: 'actualDepartureTime',
      accessorFn: (row) => formatTimeString(row.actualDepartureTime as any),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Giờ khởi hành thực tế' />
      ),
      cell: ({ row }) => {
        const actualTime = formatTimeString(
          row.original.actualDepartureTime as any
        )
        const delayed = isFlightDelayed(
          row.original.actualDepartureTime as any,
          row.original.departureTime as any
        )

        return (
          <div className='flex items-center gap-2'>
            <Clock
              className={`h-4 w-4 ${delayed ? 'text-red-600' : 'text-green-600'}`}
            />
            <span className='font-mono'>{actualTime}</span>
            {delayed && actualTime !== 'N/A' && (
              <Badge variant='destructive' className='text-xs'>
                Trễ
              </Badge>
            )}
          </div>
        )
      },
      meta: {
        label: 'Giờ khởi hành thực tế',
        placeholder: 'Tìm kiếm giờ thực tế...',
        variant: 'text',
        icon: Clock,
      },
    },
    {
      id: 'arrivalTime',
      accessorFn: (row) => formatTimeString(row.arrivalTime as any),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Giờ đến' />
      ),
      cell: ({ row }) => {
        const time = formatTimeString(row.original.arrivalTime as any)
        return (
          <div className='flex items-center gap-2'>
            <Clock className='h-4 w-4 text-blue-600' />
            <span className='font-mono'>{time}</span>
          </div>
        )
      },
      meta: {
        label: 'Giờ đến',
        placeholder: 'Tìm kiếm giờ đến...',
        variant: 'text',
        icon: Clock,
      },
    },
    {
      id: 'actualArrivalTime',
      accessorFn: (row) => formatTimeString(row.actualArrivalTime as any),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Giờ đến thực tế' />
      ),
      cell: ({ row }) => {
        const actualTime = formatTimeString(
          row.original.actualArrivalTime as any
        )
        const delayed = isFlightDelayed(
          row.original.actualArrivalTime as any,
          row.original.arrivalTime as any
        )

        return (
          <div className='flex items-center gap-2'>
            <Clock
              className={`h-4 w-4 ${delayed ? 'text-red-600' : 'text-blue-600'}`}
            />
            <span className='font-mono'>{actualTime}</span>
            {delayed && actualTime !== 'N/A' && (
              <Badge variant='destructive' className='text-xs'>
                Trễ
              </Badge>
            )}
          </div>
        )
      },
      meta: {
        label: 'Giờ đến thực tế',
        placeholder: 'Tìm kiếm giờ thực tế...',
        variant: 'text',
        icon: Clock,
      },
    },
    {
      id: 'note',
      accessorKey: 'note',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Ghi chú' />
      ),
      cell: ({ cell }) => {
        const note = cell.getValue<string>()
        return (
          <div className='max-w-[200px]'>
            {note ? (
              <div className='flex items-start gap-2'>
                <StickyNote className='text-muted-foreground mt-0.5 h-4 w-4' />
                <span className='truncate text-sm' title={note}>
                  {note}
                </span>
              </div>
            ) : (
              <span className='text-muted-foreground text-sm'>N/A</span>
            )}
          </div>
        )
      },
      meta: {
        label: 'Ghi chú',
        placeholder: 'Tìm kiếm ghi chú...',
        variant: 'text',
        icon: StickyNote,
      },
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Ngày tạo' />
      ),
      cell: ({ cell }) => {
        const value = cell.getValue<string>()
        if (!value) return <div>N/A</div>

        const date = new Date(value)
        return <div>{format(date, dateFormatPatterns.fullDateTime)}</div>
      },
      meta: {
        label: 'Ngày tạo',
        placeholder: 'Lọc theo ngày tạo...',
        variant: 'date',
        icon: Calendar,
      },
    },
    {
      id: 'updatedAt',
      accessorKey: 'updatedAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Ngày cập nhật' />
      ),
      cell: ({ cell }) => {
        const value = cell.getValue<string>()
        if (!value) return <div>N/A</div>

        const date = new Date(value)
        return <div>{format(date, dateFormatPatterns.fullDateTime)}</div>
      },
      meta: {
        label: 'Ngày cập nhật',
        placeholder: 'Lọc theo ngày cập nhật...',
        variant: 'date',
        icon: Calendar,
      },
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Hành động' />
      ),
      cell: ({ row }) => <FlightRowActions row={row} />,
      size: 20,
      meta: {
        className: 'sticky right-0 bg-background border-l',
      },
    },
  ]
}
