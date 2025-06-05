import { TasksRoute } from '@/routes/_authenticated/tasks'
import { toast } from 'sonner'
import { AppDialogInstance } from '@/hooks/use-dialog-instance'
import { AppConfirmDialog } from '@/components/app-confirm-dialog'
import { ConfirmDialogContent } from '@/components/confirm-dialog-content'
import { useDeleteTask } from '../hooks/use-delete-task'

interface DeleteTaskConfirmDialogProps {
  taskId: number
  onSuccess: () => void
  dialog: AppDialogInstance
}
export default function DeleteTaskConfirmDialog({
  taskId,
  onSuccess,
  dialog,
}: DeleteTaskConfirmDialogProps) {
  const searchParams = TasksRoute.useSearch()
  const currentType = searchParams.type || 'assigned'
  const deleteTaskMutation = useDeleteTask(currentType)

  return (
    <AppConfirmDialog dialog={dialog}>
      {dialog.isOpen && (
        <ConfirmDialogContent
          key='task-delete'
          destructive
          isLoading={deleteTaskMutation.isPending}
          handleConfirm={async () => {
            const deleteTaskPromise = deleteTaskMutation.mutateAsync({
              params: {
                path: { id: taskId },
              },
            })

            toast.promise(deleteTaskPromise, {
              loading: `Deleting task #${taskId}...`,
              success: () => {
                dialog.close()
                onSuccess()
                return `Successfully deleted task #${taskId}.`
              },
              error: `Failed to delete task #${taskId}. Please try again.`,
            })
          }}
          className='max-w-md'
          title={`Delete Task #${taskId}`}
          desc={
            <div className='space-y-2'>
              <p className='text-muted-foreground text-sm'>
                This will permanently delete task #{taskId} and all its
                associated data including:
              </p>
              <ul className='text-muted-foreground ml-2 list-inside list-disc space-y-1 text-sm'>
                <li>All assignments and their comments</li>
                <li>All attached documents</li>
                <li>Task history and progress</li>
              </ul>
              <p className='text-muted-foreground text-sm font-medium'>
                This action cannot be undone.
              </p>
            </div>
          }
        />
      )}
    </AppConfirmDialog>
  )
}
