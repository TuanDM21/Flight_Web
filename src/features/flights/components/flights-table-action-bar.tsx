'use client'

import { Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from '@/components/data-table/data-table-action-bar'
import { useFlightDeleteConfirm } from '../hooks/use-flight-delete-confirm'
import { Flight } from '../types'

interface FlightsTableActionBarProps {
  table: Table<Flight>
}

export function FlightsTableActionBar({ table }: FlightsTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows
  const { onDeleteFlights, isDeleting } = useFlightDeleteConfirm()

  const handleBulkDelete = async () => {
    if (rows.length === 0) return

    const flights = rows.map((row) => row.original)
    await onDeleteFlights(flights)

    // Clear selection after deletion attempt
    table.resetRowSelection()
  }

  return (
    <DataTableActionBar table={table} visible={rows.length > 0}>
      <DataTableActionBarSelection table={table} />
      <Separator
        orientation='vertical'
        className='hidden data-[orientation=vertical]:h-5 sm:block'
      />
      <div className='flex items-center gap-1.5'>
        <DataTableActionBarAction
          size='icon'
          tooltip='Xóa chuyến bay đã chọn'
          onClick={handleBulkDelete}
          disabled={isDeleting}
        >
          <Trash2 />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  )
}
