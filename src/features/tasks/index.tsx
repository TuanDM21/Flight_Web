'use client'

import * as React from 'react'
import { format } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'
import { dateFormatPatterns } from '@/config/date'
import {
  taskStatusIcons,
  taskStatusLabels,
  taskStatusOptions,
  taskStatusVariants,
} from '@/config/task'
import { Task } from '@/types/task'
import { DollarSign, Text } from 'lucide-react'
import TasksProvider from '@/context/task'
import { useDataTable } from '@/hooks/use-data-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableActionBar } from '@/components/data-table/data-table-action-bar'
import { DataTableAdvancedToolbar } from '@/components/data-table/data-table-advanced-toolbar'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DataTableFilterMenu } from '@/components/data-table/data-table-filter-menu'
import { DataTableSortList } from '@/components/data-table/data-table-sort-list'
import { DataTableRowActions } from './components/data-table-row-actions'
import { TaskDialogManager } from './components/tasks-dialogs'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import { TasksTableActionBar } from './components/tasks-table-action-bar'
import { mockTasks } from './mock-data'

export function TasksPage() {
  // const [content] = useQueryState('content', parseAsString.withDefault(''))
  // const [assignmentStatus] = useQueryState(
  //   'assignmentStatus',
  //   parseAsArrayOf(parseAsString).withDefault([])
  // )

  // Ideally we would filter the data server-side, but for the sake of this example, we'll filter the data client-side
  const filteredData = React.useMemo((): Task[] => {
    return mockTasks
  }, [])

  const columns = React.useMemo<ColumnDef<Task>[]>(
    () => [
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
          <DataTableColumnHeader column={column} title='Task ID' />
        ),
        cell: ({ cell }) => <div>#{cell.getValue<number>() ?? 'N/A'}</div>,
        meta: {
          className: '',
          label: 'id',
          placeholder: 'Search ID...',
          variant: 'text',
          icon: DollarSign,
        },
        enableColumnFilter: true,
      },
      {
        id: 'content',
        accessorKey: 'content',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Content' />
        ),
        cell: ({ cell }) => <div>{cell.getValue<string>() || 'N/A'}</div>,
        meta: {
          className: '',
          label: 'content',
          placeholder: 'Search content...',
          variant: 'text',
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: 'status',
        accessorFn: (row) => {
          if (!row.assignments) return null
          const status = row.assignments[0].status
          return taskStatusLabels[status]
        },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Status' />
        ),
        cell: ({ row }) => {
          const assignmentStatus = row.original.assignments?.[0]?.status ?? 0
          const Icon = taskStatusIcons[assignmentStatus]
          const label = taskStatusLabels[assignmentStatus]
          const variant = taskStatusVariants[assignmentStatus]

          return (
            <Badge
              className='flex items-center gap-1 capitalize'
              variant={variant}
            >
              <Icon className='size-4' />
              {label}
            </Badge>
          )
        },
        meta: {
          className: '',
          label: 'status',
          variant: 'multiSelect',
          options: taskStatusOptions,
        },
        enableColumnFilter: true,
      },
      {
        id: 'recipient',
        accessorFn: (row): string => {
          const assignment = row.assignments?.[0]
          if (assignment?.recipient_id && assignment?.recipient_type) {
            return `${assignment.recipient_type} (ID: ${assignment.recipient_id})`
          }
          return 'No recipient'
        },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Recipient' />
        ),
        cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
      },
      {
        id: 'due_at',
        accessorFn: (row) => {
          return row.assignments?.[0]?.due_at
        },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Due date' />
        ),
        cell: ({ cell }) => {
          const value = cell.getValue<string | undefined>()
          if (!value) return <div>Not set</div>

          const date = new Date(value)
          return <div>{format(date, dateFormatPatterns.fullDateTime)}</div>
        },
      },
      {
        id: 'created_by',
        accessorFn: (row) => {
          return row.created_by?.name
        },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Created By' />
        ),
        cell: ({ cell }) => (
          <div>{cell.getValue<string | undefined>() || 'Unknown'}</div>
        ),
      },
      {
        id: 'created_at',
        accessorKey: 'created_at',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Created At' />
        ),
        cell: ({ cell }) => {
          const value = cell.getValue<string | undefined>()
          if (!value) return <div>Unknown date</div>

          const date = new Date(value)
          return <div>{format(date, dateFormatPatterns.fullDateTime)}</div>
        },
      },
      {
        id: 'actions',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Actions' />
        ),
        cell: ({ row }) => <DataTableRowActions row={row} />,
        size: 20,
        meta: {
          className: 'sticky right-0 bg-background border-l',
        },
      },
    ],
    []
  )

  const { table, debounceMs, shallow, throttleMs } = useDataTable({
    data: filteredData,
    columns,
    pageCount: 1,
    initialState: {
      sorting: [{ id: 'content', desc: true }],
      columnPinning: { left: ['select'], right: ['actions'] },
    },
    getRowId: (row) => String(row.id ?? 'unknown'),
  })

  return (
    <TasksProvider>
      <TaskDialogManager />
      <div className='px-4 py-2'>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Tasks</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
          <TasksPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable
            table={table}
            actionBar={<TasksTableActionBar table={table} />}
          >
            <DataTableAdvancedToolbar table={table}>
              <DataTableSortList table={table} />
              <DataTableFilterMenu
                table={table}
                shallow={shallow}
                debounceMs={debounceMs}
                throttleMs={throttleMs}
              />
              <DataTableActionBar table={table} />
            </DataTableAdvancedToolbar>
          </DataTable>
        </div>
      </div>
    </TasksProvider>
  )
}
