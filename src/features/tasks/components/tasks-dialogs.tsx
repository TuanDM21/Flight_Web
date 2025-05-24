import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { taskKeysFactory } from '@/api/query-key-factory'
import { useTasks } from '@/context/task'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteTaskMutation } from '@/features/tasks/hooks/use-delete-task'
import { TaskDocument } from '../types'
import { SelectDocumentDialog } from './select-document-dialog'
import { TaskAssignmentComments } from './task-assignment-comments'
import { TasksImportDialog } from './tasks-import-dialog'
import { ViewAssignmentDialog } from './view-assignment-dialog'
import { ViewDocumentDialog } from './view-document-dialog'

export function TaskDialogManager() {
  const {
    open,
    setOpen,
    openComments,
    setOpenComments,
    currentTaskId,
    setCurrentTaskId,
    currentAssignmentId,
    openSelectDocuments,
    setOpenSelectDocuments,
  } = useTasks()

  const deleteTaskMutation = useDeleteTaskMutation(currentTaskId)
  const queryClient = useQueryClient()

  return (
    <>
      <TasksImportDialog
        key='tasks-import'
        open={open === 'import'}
        onOpenChange={() => {
          setOpen('import')
        }}
      />
      {currentTaskId && (
        <>
          <ViewAssignmentDialog
            key='view-assignment'
            open={open === 'view-assignment'}
            onOpenChange={() => {
              setOpen('view-assignment')
            }}
            taskId={currentTaskId}
          />
          <ViewDocumentDialog
            key='view-document'
            open={open === 'view-document'}
            onOpenChange={() => {
              setOpen('view-document')
            }}
            taskId={currentTaskId}
          />

          <SelectDocumentDialog
            open={openSelectDocuments}
            onOpenChange={(value) => {
              setOpenSelectDocuments(value)
            }}
            getSelectedDocumentIds={() => {
              const currentDocuments = queryClient.getQueryData<{
                data: TaskDocument[]
              }>(taskKeysFactory.documents(currentTaskId))
              if (!currentDocuments) return []

              return currentDocuments?.data.map((doc) => doc.id) as number[]
            }}
          />
        </>
      )}

      {currentTaskId && (
        <>
          <ConfirmDialog
            key='task-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setCurrentTaskId(null)
            }}
            isLoading={deleteTaskMutation.isPending}
            handleConfirm={async () => {
              if (!currentTaskId) {
                toast.error('Task ID is missing')
                return
              }
              const deleteTaskPromise = deleteTaskMutation.mutateAsync({
                params: {
                  path: { id: currentTaskId },
                },
              })
              toast.promise(deleteTaskPromise, {
                loading: `Deleting task #${currentTaskId}...`,
                success: `Task #${currentTaskId} deleted successfully!`,
                error: `Failed to delete task #${currentTaskId}. Please try again.`,
              })
              setOpen(null)
              setCurrentTaskId(null)
            }}
            className='max-w-md'
            title={`Delete Task #${currentTaskId}`}
            desc={
              <div className='space-y-2'>
                <p className='text-muted-foreground text-sm'>
                  This will permanently delete task #{currentTaskId} and all its
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
        </>
      )}

      {currentAssignmentId && (
        <>
          <TaskAssignmentComments
            assignmentId={currentAssignmentId}
            isOpen={openComments}
            onClose={() => setOpenComments(false)}
          />
        </>
      )}
    </>
  )
}
