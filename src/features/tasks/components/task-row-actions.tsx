import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useNavigate } from '@tanstack/react-router'
import { Row } from '@tanstack/react-table'
import { IconTrash } from '@tabler/icons-react'
import { FileTextIcon, PencilIcon, UserSearchIcon } from 'lucide-react'
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
import DeleteTaskConfirmDialog from './delete-task-confirm-dialog'
import { ViewAssignmentDialog } from './view-assignment-dialog'
import { ViewDocumentDialog } from './view-document-dialog'

interface TaskRowActionsProps<TData> {
  row: Row<TData>
}

export function TaskRowActions<TData>({ row }: TaskRowActionsProps<TData>) {
  const task = row.original as any
  const navigate = useNavigate()

  const viewAssignmentDialogInstance = AppDialog.useDialog()
  const viewDocumentDialogInstance = AppDialog.useDialog()
  const deleteTaskDialogInstance = AppConfirmDialog.useDialog()

  return (
    <>
      {viewAssignmentDialogInstance.isOpen && (
        <ViewAssignmentDialog
          dialog={viewAssignmentDialogInstance}
          taskId={task.id}
        />
      )}
      {viewDocumentDialogInstance.isOpen && (
        <ViewDocumentDialog
          dialog={viewDocumentDialogInstance}
          taskId={task.id}
        />
      )}
      {deleteTaskDialogInstance.isOpen && (
        <DeleteTaskConfirmDialog
          dialog={deleteTaskDialogInstance}
          taskId={task.id}
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
        <DropdownMenuContent align='end' className='w-[220px]'>
          <DropdownMenuItem onClick={viewAssignmentDialogInstance.open}>
            View assignments
            <DropdownMenuShortcut>
              <UserSearchIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={viewDocumentDialogInstance.open}>
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
              deleteTaskDialogInstance.open()
            }}
          >
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
