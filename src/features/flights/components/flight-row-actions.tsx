'use client'

import { Row } from '@tanstack/react-table'
import { IconTrash } from '@tabler/icons-react'
import { FlightsRoute } from '@/routes/_authenticated/flights'
import { MoreHorizontal, PencilIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useFlightDeleteConfirm } from '../hooks/use-flight-delete-confirm'
import { Flight } from '../types'

interface FlightRowActionsProps {
  row: Row<Flight>
}

export function FlightRowActions({ row }: FlightRowActionsProps) {
  const flight = row.original
  const { onDeleteFlight, isDeleting } = useFlightDeleteConfirm()
  const navigate = FlightsRoute.useNavigate()

  const handleDelete = async () => {
    await onDeleteFlight(flight)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
        >
          <MoreHorizontal className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem
          onClick={() => {
            navigate({
              to: '/flights/$flight-id/edit',
              params: { 'flight-id': String(flight.id) },
            })
          }}
        >
          Chỉnh sửa
          <DropdownMenuShortcut>
            <PencilIcon />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} disabled={isDeleting}>
          Xóa
          <DropdownMenuShortcut>
            <IconTrash />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
