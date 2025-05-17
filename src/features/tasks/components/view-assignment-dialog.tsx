import { format } from 'date-fns'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'
import { IconTrash } from '@tabler/icons-react'
import { dateFormatPatterns } from '@/config/date'
import {
  taskStatusIcons,
  taskStatusLabels,
  taskStatusVariants,
} from '@/config/task'
import { Task, TaskAssignment } from '@/types/task'
import { useTasks } from '@/context/task'
import { useDataTable } from '@/hooks/use-data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Task | null
}

export function ViewAssignmentDialog({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const assignmentColumns: ColumnDef<TaskAssignment>[] = [
    {
      id: 'recipientType',
      accessorKey: 'recipientType',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Type' />
      ),
      cell: ({ cell }) => (
        <div className='capitalize'>{cell.getValue<string>() || 'N/A'}</div>
      ),
      size: 100,
      enableSorting: false,
    },
    {
      id: 'recipientUser',
      accessorKey: 'recipientUser',
      accessorFn: (row) => row.recipientUser?.name ?? '',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Recipient ID' />
      ),
      cell: ({ cell }) => <div>{cell.getValue<number>() || 'N/A'}</div>,
      size: 100,
      enableSorting: false,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }) => {
        const status = row.original.status || 0
        const Icon = taskStatusIcons[status]
        const label = taskStatusLabels[status]
        const variant = taskStatusVariants[status]

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
      size: 120,
      enableSorting: false,
    },
    {
      id: 'assignedByUser',
      accessorKey: 'assignedByUser',
      accessorFn: (row) => row.assignedByUser?.name ?? '',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Assigned By' />
      ),
      cell: ({ cell }) => <div>{cell.getValue<number>() || 'N/A'}</div>,
      size: 100,
      enableSorting: false,
    },
    {
      id: 'assignedAt',
      accessorKey: 'assignedAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Assigned At' />
      ),
      cell: ({ cell }) => {
        const value = cell.getValue<string>()
        if (!value) return <div>Not set</div>

        const date = new Date(value)
        return <div>{format(date, dateFormatPatterns.fullDateTime)}</div>
      },
      enableSorting: false,
    },
    {
      id: 'dueAt',
      accessorKey: 'dueAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Due At' />
      ),
      cell: ({ cell }) => {
        const value = cell.getValue<string | null>()
        if (!value) return <div>Not set</div>

        const date = new Date(value)
        return <div>{format(date, dateFormatPatterns.fullDateTime)}</div>
      },
      enableSorting: false,
    },
    {
      id: 'note',
      accessorKey: 'note',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Note' />
      ),
      cell: ({ cell }) => <div>{cell.getValue<string>() || 'No notes'}</div>,
      size: 200,
      enableSorting: false,
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Actions' />
      ),
      cell: ({ row }) => {
        const assignment = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
              >
                <DotsHorizontalIcon className='h-4 w-4' />
                <span className='sr-only'>Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[160px]'>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup value={String(assignment.status)}>
                    {Object.entries(taskStatusLabels).map(([value, label]) => (
                      <DropdownMenuRadioItem
                        key={value}
                        value={value}
                        disabled={value === String(assignment.status)}
                      >
                        {label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeleteAssignment(assignment)}
              >
                Delete
                <DropdownMenuShortcut>
                  <IconTrash size={16} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      size: 20,
      meta: {
        className: 'sticky right-0 bg-background border-l',
      },
      enableSorting: false,
    },
  ]

  const { table: assignmentsTable } = useDataTable({
    data: currentRow?.assignments || [],
    columns: assignmentColumns,
    pageCount: 1,
  })
  const { setOpen, setCurrentAssignmentRow, setCurrentRow } = useTasks()

  const handleDeleteAssignment = (assignment: TaskAssignment) => {
    setCurrentAssignmentRow(assignment)
    setCurrentRow(currentRow)
    setOpen('delete-assignment')
  }

  const noAssignments =
    !currentRow?.assignments || currentRow.assignments.length === 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-7xl flex flex-col sm:max-w-7xl'>
        <DialogHeader className='pb-4'>
          <DialogTitle>All Assignments for Task #{currentRow?.id}</DialogTitle>
          <p className='text-muted-foreground mt-1 text-sm'>
            View all assignments for this task
          </p>
        </DialogHeader>

        {noAssignments ? (
          <div className='text-muted-foreground flex h-[200px] items-center justify-center py-8'>
            No assignments available
          </div>
        ) : (
          <DataTable table={assignmentsTable} />
        )}
      </DialogContent>
    </Dialog>
  )
}
