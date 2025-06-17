import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { IconTrash } from '@tabler/icons-react'
import { TasksRoute } from '@/routes/_authenticated/tasks'
import { PencilIcon } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { useDialogs } from '@/hooks/use-dialogs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDeleteTasksConfirm } from '../hooks/use-delete-tasks-confirm'
import { Task } from '../types'
import { TaskAssignmentsDialog } from './task-assignments-dialog'
import { TaskDocumentsDialog } from './task-documents-dialog'

interface TaskRowActionsProps {
  row: Row<Task>
}

export function TaskRowActions({ row }: TaskRowActionsProps) {
  const task = row.original
  const searchParams = TasksRoute.useSearch()
  const navigate = TasksRoute.useNavigate()
  const filterType = searchParams.type || 'assigned'
  const { user } = useAuth()
  const isTaskOwner = user?.id === task.createdByUser?.id
  const dialogs = useDialogs()
  const { onDeleteTasks } = useDeleteTasksConfirm(filterType)

  const handleViewAssignments = async () => {
    await dialogs.open(TaskAssignmentsDialog, {
      task,
    })
  }

  const handleViewDocuments = async () => {
    await dialogs.open(TaskDocumentsDialog, {
      task,
    })
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Mở menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={handleViewAssignments}>
            <div className='flex w-full items-center justify-between'>
              <div className='flex items-center'>
                <span>Xem phân công</span>
              </div>
              <Badge variant='secondary' className='ml-2 text-xs'>
                {task?.assignments?.length ?? 0}
              </Badge>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleViewDocuments}>
            <div className='flex w-full items-center justify-between'>
              <div className='flex items-center'>
                <span>Xem tài liệu</span>
              </div>
              <Badge variant='secondary' className='ml-2 text-xs'>
                {task?.documents?.length ?? 0}
              </Badge>
            </div>
          </DropdownMenuItem>
          {isTaskOwner && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  navigate({
                    to: '/tasks/$task-id/edit',
                    params: { 'task-id': String(task.id) },
                    search: (prev) => ({
                      ...prev,
                      type: filterType,
                    }),
                  })
                }}
              >
                Chỉnh sửa
                <DropdownMenuShortcut>
                  <PencilIcon />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDeleteTasks([task])}>
                Xóa
                <DropdownMenuShortcut>
                  <IconTrash />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
