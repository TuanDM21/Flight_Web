import { toast } from 'sonner'
import { AppDialogInstance } from '@/hooks/use-dialog-instance'
import { AppConfirmDialog } from '@/components/app-confirm-dialog'
import { ConfirmDialogContent } from '@/components/confirm-dialog-content'
import { useDeleteTaskAssignmentMutation } from '../hooks/use-delete-task-assignment'
import { TaskAssignment } from '../types'

interface DeleteTaskAssignmentConfirmDialogProps {
  taskId: number
  assignment: TaskAssignment
  onSuccess?: () => void
  dialog: AppDialogInstance
}

export default function DeleteTaskAssignmentConfirmDialog({
  taskId,
  assignment,
  onSuccess,
  dialog,
}: DeleteTaskAssignmentConfirmDialogProps) {
  const deleteAssignmentMutation = useDeleteTaskAssignmentMutation(taskId)

  const recipientName =
    assignment?.recipientUser?.name ||
    assignment?.recipientUser?.teamName ||
    assignment?.recipientUser?.unitName ||
    'this recipient'

  return (
    <AppConfirmDialog dialog={dialog}>
      {dialog.isOpen && (
        <ConfirmDialogContent
          key='task-assignment-delete'
          destructive
          isLoading={deleteAssignmentMutation.isPending}
          handleConfirm={async () => {
            if (!assignment.assignmentId) return

            const deleteAssignmentPromise =
              deleteAssignmentMutation.mutateAsync({
                params: {
                  path: {
                    id: assignment.assignmentId,
                  },
                },
              })

            toast.promise(deleteAssignmentPromise, {
              loading: 'Deleting assignment...',
              success: () => {
                dialog.close()
                onSuccess?.()
                return `Successfully deleted assignment for ${recipientName}.`
              },
              error: 'Error deleting assignment',
            })
          }}
          className='max-w-md'
          title='Delete Assignment'
          desc={
            <div className='space-y-2'>
              <p className='text-muted-foreground text-sm'>
                You are about to delete the assignment for{' '}
                <span className='text-foreground font-medium'>
                  {recipientName}
                </span>
                .
              </p>
              <p className='text-muted-foreground text-sm'>
                This will remove all comments and progress associated with this
                assignment.
              </p>
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
