import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import type { Column, ColumnDef } from '@tanstack/react-table'
import {
  CheckCircle,
  CheckCircle2,
  DollarSign,
  MoreHorizontal,
  Text,
  XCircle,
} from 'lucide-react'
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs'
import { DataTable } from '~/components/data-table/data-table'
import { DataTableAdvancedToolbar } from '~/components/data-table/data-table-advanced-toolbar'
import { DataTableColumnHeader } from '~/components/data-table/data-table-column-header'
import { DataTableFilterMenu } from '~/components/data-table/data-table-filter-menu'
import { DataTableToolbar } from '~/components/data-table/data-table-toolbar'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { useDataTable } from '~/hooks/use-data-table'

export const Route = createFileRoute('/_authenticated/tasks/')({
  component: TaskListPage,
})

// Đầu file: Thêm interface cho Task
interface Task {
  id: number
  content: string
  created_at: string
  updated_at: string
  created_by: {
    id: number
    name: string
  }
  assignments: {
    recipient_id: number
    recipient_type: 'user' | 'team' | 'unit'
    status: 0 | 1 | 2
    assigned_at: string
    due_at: string
    completed_at: string | null
    completed_by: number | null
  }[]
}

// Mock data
const mockTasks: {
  status: 'success'
  data: Task[]
  pagination: {
    total: number
    page: number
    limit: number
  }
} = {
  status: 'success',
  data: [
    {
      id: 101,
      content: 'Prepare Q1 financial report',
      created_at: '2025-04-01T10:00:00Z',
      updated_at: '2025-04-05T14:30:00Z',
      created_by: { id: 1, name: 'Alice' },
      assignments: [
        {
          recipient_id: 10,
          recipient_type: 'user',
          status: 1,
          assigned_at: '2025-04-01T11:00:00Z',
          due_at: '2025-04-10T00:00:00Z',
          completed_at: null,
          completed_by: null,
        },
      ],
    },
    {
      id: 102,
      content: 'Team meeting for project roadmap',
      created_at: '2025-04-02T09:00:00Z',
      updated_at: '2025-04-04T16:00:00Z',
      created_by: { id: 2, name: 'Bob' },
      assignments: [
        {
          recipient_id: 5,
          recipient_type: 'team',
          status: 2,
          assigned_at: '2025-04-02T10:00:00Z',
          due_at: '2025-04-07T00:00:00Z',
          completed_at: '2025-04-06T15:00:00Z',
          completed_by: 3,
        },
      ],
    },
    {
      id: 103,
      content: 'Update security protocols',
      created_at: '2025-03-28T08:30:00Z',
      updated_at: '2025-04-01T12:00:00Z',
      created_by: { id: 3, name: 'Charlie' },
      assignments: [
        {
          recipient_id: 7,
          recipient_type: 'unit',
          status: 0,
          assigned_at: '2025-03-28T09:00:00Z',
          due_at: '2025-04-15T00:00:00Z',
          completed_at: null,
          completed_by: null,
        },
      ],
    },
  ],
  pagination: {
    total: 3,
    page: 1,
    limit: 10,
  },
}

export function TaskListPage() {
  const [title] = useQueryState('title', parseAsString.withDefault(''))
  const [creator] = useQueryState('creator', parseAsString.withDefault(''))

  const filteredData = React.useMemo(() => {
    return mockTasks.data.filter((task) => {
      const matchTitle =
        title === '' || task.content.toLowerCase().includes(title.toLowerCase())
      const matchCreator =
        creator === '' ||
        task.created_by.name.toLowerCase().includes(creator.toLowerCase())
      return matchTitle && matchCreator
    })
  }, [title, creator])

  const columns = React.useMemo<ColumnDef<Task>[]>(
    () => [
      {
        id: 'id',
        header: 'ID',
        accessorKey: 'id',
        cell: ({ row }) => <div>{row.original.id}</div>,
      },
      {
        id: 'id',
        header: 'ID123',
        accessorKey: 'id',
        cell: ({ row }) => <div>{row.original.id}</div>,
      },
      {
        id: 'content',
        header: 'Content',
        accessorKey: 'content',
        cell: ({ row }) => <div>{row.original.content}</div>,
      },
      {
        id: 'content',
        header: 'Content123',
        accessorKey: 'content',
        cell: ({ row }) => <div>{row.original.content}</div>,
      },
      {
        id: 'created_by',
        header: 'Created By',
        accessorFn: (row) => row.created_by.name,
        cell: ({ row }) => <div>{row.original.created_by.name}</div>,
      },
      {
        id: 'created_at',
        header: 'Created At',
        accessorFn: (row) => new Date(row.created_at).toLocaleString(),
        cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
      },
      {
        id: 'updated_at',
        header: 'Updated At',
        accessorFn: (row) => new Date(row.updated_at).toLocaleString(),
        cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
      },
      {
        id: 'assignees_count',
        header: '# Assignees',
        accessorFn: (row) => row.assignments.length,
        cell: ({ cell }) => <div>{cell.getValue<number>()}</div>,
      },
      {
        id: 'completed_count',
        header: '# Completed',
        accessorFn: (row) =>
          row.assignments.filter((a) => a.status === 2).length,
        cell: ({ cell }) => <div>{cell.getValue<number>()}</div>,
      },
      {
        id: 'nearest_due',
        header: 'Due At (Nearest)',
        accessorFn: (row) => {
          const dueDates = row.assignments
            .map((a) => new Date(a.due_at))
            .filter((d) => !isNaN(d.getTime()))
          if (dueDates.length === 0) return 'N/A'
          const nearest = dueDates.reduce((a, b) => (a < b ? a : b))
          return nearest.toLocaleDateString()
        },
        cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
      },
      {
        id: 'status',
        header: 'Status',
        accessorFn: (row) => {
          const statuses = row.assignments.map((a) => a.status)
          if (statuses.length === 0) return 'Unassigned'
          if (statuses.every((s) => s === 2)) return 'Done'
          if (statuses.some((s) => s === 1)) return 'In Progress'
          return 'Pending'
        },
        cell: ({ cell }) => {
          const value = cell.getValue<string>()
          const color =
            value === 'Done'
              ? 'text-green-600'
              : value === 'In Progress'
                ? 'text-yellow-600'
                : value === 'Pending'
                  ? 'text-gray-500'
                  : 'text-muted-foreground'
          return <span className={`font-medium ${color}`}>{value}</span>
        },
      },
      {
        id: 'actions',
        header: '',
        cell: function Cell() {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon'>
                  <MoreHorizontal className='h-4 w-4' />
                  <span className='sr-only'>Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem variant='destructive'>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
        size: 32,
      },
    ],
    []
  )

  const { table, shallow, debounceMs, throttleMs } = useDataTable({
    data: filteredData,
    columns,
    pageCount: 1,
    initialState: {
      sorting: [{ id: 'content', desc: false }],
      columnPinning: { right: ['actions'] },
    },
    getRowId: (row) => row.id.toString(),
  })

  return (
    <DataTable table={table}>
      <DataTableAdvancedToolbar table={table}>
        <DataTableFilterMenu
          table={table}
          shallow={shallow}
          debounceMs={debounceMs}
          throttleMs={throttleMs}
        />
      </DataTableAdvancedToolbar>
    </DataTable>
  )
}
