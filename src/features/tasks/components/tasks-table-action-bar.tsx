'use client'

import { Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from '@/components/data-table/data-table-action-bar'
import { Task } from '@/features/tasks/types'

interface TasksTableActionBarProps {
  table: Table<Task>
}

export function TasksTableActionBar({ table }: TasksTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows

  return (
    <DataTableActionBar table={table} visible={rows.length > 0}>
      <DataTableActionBarSelection table={table} />
      <Separator
        orientation='vertical'
        className='hidden data-[orientation=vertical]:h-5 sm:block'
      />
      <div className='flex items-center gap-1.5'>
        <DataTableActionBarAction size='icon' tooltip='Xóa nhiệm vụ'>
          <Trash2 />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  )
}
