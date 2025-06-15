import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { dateFormatPatterns } from '@/config/date'
import {
  BadgeCheck,
  CalendarSearch,
  DollarSign,
  Text,
  UserSearch,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Task } from '@/features/tasks/types'
import { TaskRowActions } from '../components/task-row-actions'
import { taskStatusOptions } from '../utils/tasks'

export function useTasksTableColumns(): ColumnDef<Task>[] {
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
        <DataTableColumnHeader column={column} title='ID Công việc' />
      ),
      cell: ({ cell }) => {
        const taskId = cell.getValue<number>()
        return (
          <Button variant='link' size='sm' asChild className='h-auto p-0'>
            <Link to='/tasks/$task-id' params={{ 'task-id': String(taskId) }}>
              #{taskId ?? 'N/A'}
            </Link>
          </Button>
        )
      },
      meta: {
        label: 'Task ID',
        placeholder: 'Search task ID...',
        variant: 'text',
        icon: DollarSign,
      },
      enableColumnFilter: true,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Trạng thái' />
      ),
      cell: ({ cell }) => <div>{cell.getValue<string>() ?? 'N/A'}</div>,
      meta: {
        className: '',
        label: 'Status',
        placeholder: 'Search Status...',
        variant: 'select',
        options: taskStatusOptions,
        icon: BadgeCheck,
      },
      enableColumnFilter: true,
    },
    {
      id: 'content',
      accessorKey: 'content',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Nội dung' />
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
        <DataTableColumnHeader column={column} title='Người tạo' />
      ),
      cell: ({ cell }) => {
        return (
          <div>{cell.getValue<string | undefined>() || 'Không xác định'}</div>
        )
      },
      meta: {
        className: '',
        label: 'Người tạo',
        placeholder: 'Tìm kiếm người tạo...',
        variant: 'text',
        icon: UserSearch,
      },
      enableColumnFilter: true,
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Ngày tạo' />
      ),
      cell: ({ cell }) => {
        const value = cell.getValue<string | undefined>()
        if (!value) return <div>Chưa đặt</div>

        const date = new Date(value)
        return <div>{format(date, dateFormatPatterns.fullDateTime)}</div>
      },
      meta: {
        className: '',
        label: 'Ngày tạo',
        placeholder: 'Lọc theo ngày tạo...',
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
        <DataTableColumnHeader column={column} title='Ngày cập nhật' />
      ),
      cell: ({ cell }) => {
        const value = cell.getValue<string | undefined>()
        if (!value) return <div>Not set</div>

        const date = new Date(value)
        return <div>{format(date, dateFormatPatterns.fullDateTime)}</div>
      },
      meta: {
        className: '',
        label: 'Ngày cập nhật',
        placeholder: 'Lọc theo ngày cập nhật...',
        variant: 'date',
        icon: CalendarSearch,
      },
      enableColumnFilter: true,
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Hành động' />
      ),
      cell: ({ row }) => <TaskRowActions row={row} />,
      size: 20,
      meta: {
        className: 'sticky right-0 bg-background border-l',
      },
    },
  ]
}
