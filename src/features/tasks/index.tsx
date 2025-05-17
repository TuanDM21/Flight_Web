'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import { dateFormatPatterns } from '@/config/date'
import {
  getTaskListQueryOptions,
  TaskListRoute,
} from '@/routes/_authenticated/tasks'
import { Task, TaskFilters } from '@/types/task'
import {
  CalendarSearch,
  DollarSign,
  Search,
  Text,
  UserSearch,
} from 'lucide-react'
import { parseAsString, useQueryState } from 'nuqs'
import { getValidFilters } from '@/lib/data-table'
import { filterColumns } from '@/lib/filter-columns'
import { sortColumns } from '@/lib/sort-columns'
import TasksProvider from '@/context/task'
import { useDataTable } from '@/hooks/use-data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableActionBar } from '@/components/data-table/data-table-action-bar'
import { DataTableAdvancedToolbar } from '@/components/data-table/data-table-advanced-toolbar'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DataTableFilterMenu } from '@/components/data-table/data-table-filter-menu'
import { DataTableSortList } from '@/components/data-table/data-table-sort-list'
import { TaskRowActions } from './components/task-row-actions'
import { TaskDialogManager } from './components/tasks-dialogs'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import { TasksTableActionBar } from './components/tasks-table-action-bar'
import { taskSearchParamsCache } from './utils'

export function TaskListPage() {
  const { data: getTaskListQuery } = useSuspenseQuery(getTaskListQueryOptions())
  const [queryFilter, setQueryFilter] = useQueryState(
    'q',
    parseAsString.withDefault('')
  )

  const searchParams = TaskListRoute.useSearch()
  const search = taskSearchParamsCache.parse(searchParams)
  const validFilters = getValidFilters(search.filters as any[])

  // Update isFiltering state based on both text search and column filters
  const isFiltering = Boolean(queryFilter) || validFilters.length > 0

  const filteredData = React.useMemo((): Task[] => {
    const tasks = getTaskListQuery.data ?? []

    // Text search filter
    let filteredTasks = tasks
    if (queryFilter) {
      const searchTerm = String(queryFilter).toLowerCase()
      filteredTasks = tasks.filter((task) => {
        // Search in multiple fields - adjust as needed for your data structure
        const content = (task.content || '').toLowerCase()
        const createdBy = (task.createdByUser?.name ?? '')
          ?.toString()
          .toLowerCase()

        return content.includes(searchTerm) || createdBy.includes(searchTerm)
      })
    }

    // Apply column filters using filterColumns
    if (validFilters.length > 0) {
      const filterFn = filterColumns<TaskFilters>({
        filters: validFilters,
        joinOperator: 'or',
      })

      if (filterFn) {
        filteredTasks = filteredTasks.filter(filterFn)
      }
    }

    // Apply sorting using sortColumns
    if (search.sort.length > 0) {
      filteredTasks = sortColumns<Task>(filteredTasks, search.sort as any[])
    }

    return filteredTasks
  }, [getTaskListQuery.data, queryFilter, validFilters, search.sort])

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
          label: 'Task ID',
          placeholder: 'Search task ID...',
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
          label: 'Content',
          placeholder: 'Search content...',
          variant: 'text',
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: 'createdBy',
        accessorFn: (row) => row.createdByUser?.name,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Created By' />
        ),
        cell: ({ cell }) => {
          return <div>{cell.getValue<string | undefined>() || 'Unknown'}</div>
        },
        meta: {
          className: '',
          label: 'Created By',
          placeholder: 'Search creator...',
          variant: 'text',
          icon: UserSearch,
        },
        enableColumnFilter: true,
      },
      {
        id: 'createdAt',
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Created At' />
        ),
        cell: ({ cell }) => {
          const value = cell.getValue<string | undefined>()
          if (!value) return <div>Not set</div>

          const date = new Date(value)
          return <div>{format(date, dateFormatPatterns.fullDateTime)}</div>
        },
        meta: {
          className: '',
          label: 'Created At',
          placeholder: 'Filter by creation date...',
          variant: 'date',
          icon: CalendarSearch,
        },
        enableColumnFilter: true,
      },
      {
        id: 'updatedAt',
        accessorKey: 'updatedAt',
        accessorFn: (row) => row.updatedAt,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Updated At' />
        ),
        cell: ({ cell }) => {
          const value = cell.getValue<string | undefined>()
          if (!value) return <div>Not set</div>

          const date = new Date(value)
          return <div>{format(date, dateFormatPatterns.fullDateTime)}</div>
        },
        meta: {
          className: '',
          label: 'Updated At',
          placeholder: 'Filter by update date...',
          variant: 'date',
          icon: CalendarSearch,
        },
        enableColumnFilter: true,
      },
      {
        id: 'actions',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Actions' />
        ),
        cell: ({ row }) => <TaskRowActions row={row} />,
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
      sorting: [{ id: 'createdAt', desc: false }],
      columnPinning: { right: ['actions'] },
    },
    getRowId: (row) => String(row.id ?? 'unknown'),
    shallow: false,
    clearOnDefault: true,
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
          <React.Suspense fallback={<div>Loading...</div>}>
            <DataTable table={table}>
              <TasksTableActionBar table={table} />
              <DataTableAdvancedToolbar table={table}>
                <DataTableSortList table={table} />
                <DataTableFilterMenu
                  table={table}
                  shallow={shallow}
                  debounceMs={debounceMs}
                  throttleMs={throttleMs}
                />
                <div className='flex items-center gap-2'>
                  <Search
                    className={`absolute top-2.5 left-2 h-4 w-4 ${isFiltering ? 'text-primary' : 'text-muted-foreground'}`}
                  />
                  <Input
                    placeholder='Search tasks...'
                    className={`w-full pl-8 ${isFiltering ? 'border-primary' : ''}`}
                    value={queryFilter}
                    onChange={(e) => void setQueryFilter(e.target.value)}
                  />
                </div>
                <DataTableActionBar table={table} />
              </DataTableAdvancedToolbar>
            </DataTable>
          </React.Suspense>
        </div>
      </div>
    </TasksProvider>
  )
}
