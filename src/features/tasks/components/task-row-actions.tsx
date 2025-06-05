import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { IconTrash } from '@tabler/icons-react'
import { TasksRoute } from '@/routes/_authenticated/tasks'
import { PencilIcon } from 'lucide-react'
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
import { AppConfirmDialog } from '@/components/app-confirm-dialog'
import { AppDialog } from '@/components/app-dialog'
import { Task } from '../types'
import DeleteTaskConfirmDialog from './delete-task-confirm-dialog'
import { ViewAssignmentDialog } from './view-assignment-dialog'
import { ViewDocumentDialog } from './view-document-dialog'

interface TaskRowActionsProps {
  row: Row<Task>
}

export function TaskRowActions({ row }: TaskRowActionsProps) {
  const task = row.original
  const searchParams = TasksRoute.useSearch()
  const navigate = TasksRoute.useNavigate()
  const currentType = searchParams.type || 'assigned'

  const viewAssignmentDialogInstance = AppDialog.useDialog()
  const viewDocumentDialogInstance = AppDialog.useDialog()
  const deleteTaskDialogInstance = AppConfirmDialog.useDialog()

  return (
    <>
      {viewAssignmentDialogInstance.isOpen && (
        <ViewAssignmentDialog
          dialog={viewAssignmentDialogInstance}
          taskId={task.id!}
        />
      )}
      {viewDocumentDialogInstance.isOpen && (
        <ViewDocumentDialog
          dialog={viewDocumentDialogInstance}
          taskId={task.id!}
        />
      )}
      {deleteTaskDialogInstance.isOpen && (
        <DeleteTaskConfirmDialog
          dialog={deleteTaskDialogInstance}
          taskId={task.id!}
          onSuccess={deleteTaskDialogInstance.close}
        />
      )}

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
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={viewAssignmentDialogInstance.open}>
            <div className='flex w-full items-center justify-between'>
              <div className='flex items-center'>
                <span>View assignments</span>
              </div>
              <Badge variant='secondary' className='ml-2 text-xs'>
                {task?.assignments?.length ?? 0}
              </Badge>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={viewDocumentDialogInstance.open}>
            <div className='flex w-full items-center justify-between'>
              <div className='flex items-center'>
                <span>View documents</span>
              </div>
              <Badge variant='secondary' className='ml-2 text-xs'>
                {task?.documents?.length ?? 0}
              </Badge>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              navigate({
                to: '/tasks/$task-id/edit',
                params: { 'task-id': String(task.id) },
                search: (prev) => ({
                  ...prev,
                  type: currentType,
                }),
              })
            }}
          >
            Edit
            <DropdownMenuShortcut>
              <PencilIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={deleteTaskDialogInstance.open}>
            Delete
            <DropdownMenuShortcut>
              <IconTrash />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
