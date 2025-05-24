import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useNavigate } from '@tanstack/react-router'
import { Row } from '@tanstack/react-table'
import { IconTrash } from '@tabler/icons-react'
import { FileTextIcon, PencilIcon, UserSearchIcon } from 'lucide-react'
import { useTasks } from '@/context/task'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface TaskRowActionsProps<TData> {
  row: Row<TData>
}

export function TaskRowActions<TData>({ row }: TaskRowActionsProps<TData>) {
  const task = row.original as any
  const navigate = useNavigate()
  const { setOpen, setCurrentTaskId } = useTasks()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[220px]'>
        <DropdownMenuItem
          onClick={() => {
            setCurrentTaskId(task.id)
            setOpen('view-assignment')
          }}
        >
          View assignments
          <DropdownMenuShortcut>
            <UserSearchIcon />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCurrentTaskId(task.id)
            setOpen('view-document')
          }}
        >
          View documents
          <DropdownMenuShortcut>
            <FileTextIcon />
          </DropdownMenuShortcut>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            navigate({
              to: '/tasks/$task-id/edit',
              params: { 'task-id': task.id },
            })
          }}
        >
          Edit
          <DropdownMenuShortcut>
            <PencilIcon />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCurrentTaskId(task.id)
            setOpen('delete')
          }}
        >
          Delete
          <DropdownMenuShortcut>
            <IconTrash />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
