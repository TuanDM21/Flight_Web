'use client'

import * as React from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { faker } from '@faker-js/faker'
import {
  CheckCircle,
  CheckCircle2,
  DollarSign,
  MoreHorizontal,
  Text,
  XCircle,
} from 'lucide-react'
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs'
import { useDataTable } from '@/hooks/use-data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableActionBar } from '@/components/data-table/data-table-action-bar'
import { DataTableAdvancedToolbar } from '@/components/data-table/data-table-advanced-toolbar'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DataTableFilterMenu } from '@/components/data-table/data-table-filter-menu'
import { DataTableSortList } from '@/components/data-table/data-table-sort-list'
import { TasksTableActionBar } from './components/tasks-table-action-bar'
import { Task } from './data/schema'

export const mockTasks: Task[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  content: faker.lorem.sentence(),
  created_at: faker.date.past().toISOString(),
  updated_at: faker.date.recent().toISOString(),
  created_by: {
    id: faker.number.int({ min: 1, max: 10 }),
    name: faker.person.fullName(),
  },
  assignments: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(
    () => {
      const status = faker.helpers.arrayElement([0, 1, 2]) as 0 | 1 | 2
      return {
        recipient_id: faker.number.int({ min: 1, max: 100 }),
        recipient_type: faker.helpers.arrayElement(['user', 'team', 'unit']),
        status,
        assigned_at: faker.date.past().toISOString(),
        due_at: faker.date.future().toISOString(),
        completed_at: status === 2 ? faker.date.recent().toISOString() : null,
        completed_by:
          status === 2 ? faker.number.int({ min: 1, max: 10 }) : null,
      }
    }
  ),
}))
export function TasksPage() {
  const [content] = useQueryState('content', parseAsString.withDefault(''))
  const [assignmentStatus] = useQueryState(
    'assignmentStatus',
    parseAsArrayOf(parseAsString).withDefault([])
  )

  // Ideally we would filter the data server-side, but for the sake of this example, we'll filter the data client-side
  const filteredData = React.useMemo(() => {
    return mockTasks.filter((task) => {
      const matchesContent =
        content === '' ||
        task.content.toLowerCase().includes(content.toLowerCase())

      const matchesAssignmentStatus =
        assignmentStatus.length === 0 ||
        task.assignments.some((a) =>
          assignmentStatus.includes(a.status.toString())
        )

      return matchesContent && matchesAssignmentStatus
    })
  }, [content, assignmentStatus])

  const columns = React.useMemo<ColumnDef<Task>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label='Select all'
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label='Select row'
          />
        ),
        size: 32,
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: 'id',
        accessorKey: 'id',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='ID' />
        ),
        cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
        meta: {
          className: '',
          label: 'ID',
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
        cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
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
        id: 'status',
        accessorFn: (row) => row.assignments[0]?.status ?? null,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Status' />
        ),
        cell: ({ row }) => {
          const status = row.original.assignments[0]?.status
          let label: string = 'Unknown'
          let color:
            | 'default'
            | 'outline'
            | 'secondary'
            | 'destructive'
            | null
            | undefined = 'outline'
          let Icon = XCircle

          switch (status) {
            case 0:
              label = 'Pending'
              Icon = XCircle
              break
            case 1:
              label = 'In Progress'
              Icon = Text
              break
            case 2:
              label = 'Completed'
              Icon = CheckCircle2
              break
          }

          return (
            <Badge
              variant={color}
              className='flex items-center gap-1 capitalize'
            >
              <Icon className='size-4' />
              {label}
            </Badge>
          )
        },
        meta: {
          className: '',
          label: 'Status',
          variant: 'multiSelect',
          options: [
            { label: 'Pending', value: '0', icon: XCircle },
            { label: 'In Progress', value: '1', icon: Text },
            { label: 'Completed', value: '2', icon: CheckCircle },
          ],
        },
        enableColumnFilter: true,
      },
      {
        id: 'created_by',
        accessorFn: (row) => row.created_by.name,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Created By' />
        ),
        cell: ({ cell }) => <div>{cell.getValue<string>()}</div>,
      },
      {
        id: 'created_at',
        accessorKey: 'created_at',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Created At' />
        ),
        cell: ({ cell }) => {
          const date = new Date(cell.getValue<string>())
          return <div>{date.toLocaleString()}</div>
        },
      },
      {
        id: 'actions',
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
                <DropdownMenuItem className='text-red-500'>
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

  const { table, debounceMs, shallow, throttleMs } = useDataTable({
    data: filteredData,
    columns,
    pageCount: 1,
    initialState: {
      sorting: [{ id: 'content', desc: true }],
      columnPinning: { right: ['actions'] },
    },
    getRowId: (row) => row.id.toString(),
  })
  return (
    <DataTable table={table} actionBar={<TasksTableActionBar table={table} />}>
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
  )
}
