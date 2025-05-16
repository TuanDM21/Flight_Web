import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { Task } from '@/types/task'
import { toast } from 'sonner'
import { taskKeysFactory } from '@/api/query-key-factory'
import { useTasks } from '@/context/task'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { TasksImportDialog } from './tasks-import-dialog'
import { ViewAssignmentDialog } from './view-assignment-dialog'
import { ViewDocumentDialog } from './view-document-dialog'

export function TaskDialogManager() {
  const {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    currentAssignmentRow,
    setCurrentAssignmentRow,
    currentDocumentRow,
    setCurrentDocumentRow,
  } = useTasks()
  const queryClient = useQueryClient()

  // Create delete task mutation with optimistic updates
  const deleteTaskMutation = $queryClient.useMutation(
    'delete',
    '/api/tasks/{id}',
    {
      onMutate: async (variables: any) => {
        // Get the task ID from the variables
        const taskId = variables?.params?.path?.id
        if (!taskId) return {}

        // Cancel any outgoing refetches to avoid overwriting our optimistic update
        await queryClient.cancelQueries({
          queryKey: taskKeysFactory.lists(),
        })

        // Snapshot the previous value
        const previousTasks = queryClient.getQueryData(taskKeysFactory.lists())

        // Optimistically update by removing the task with the given ID
        queryClient.setQueryData(
          taskKeysFactory.lists(),
          (old: { data: Task[] }) => {
            if (!old?.data) return old

            return {
              ...old,
              data: old.data.filter((task) => task.id !== Number(taskId)),
            }
          }
        )

        // Also remove the task detail if it's in the cache
        queryClient.removeQueries({
          queryKey: taskKeysFactory.detail(Number(taskId)),
        })

        return { previousTasks }
      },
      onSuccess: (_, variables) => {
        // Get the task ID from the variables for a better message
        const taskId = variables?.params?.path?.id

        const message = `Task #${taskId} deleted successfully!`

        toast.success(message, {
          description: 'The task has been permanently removed.',
        })
      },
      onError: (_, __, context: any) => {
        if (context?.previousTasks) {
          queryClient.setQueryData(
            taskKeysFactory.lists(),
            context.previousTasks
          )
        }

        let errorMessage = 'Failed to delete task'
        toast.error(errorMessage, {
          description:
            'Please try again or contact support if the problem persists.',
          duration: 5000,
        })
      },
      onSettled: (_, variables: any) => {
        // Get the task ID from the variables
        const taskId = variables?.params?.path?.id

        // Always refetch after error or success
        queryClient.invalidateQueries({
          queryKey: taskKeysFactory.lists(),
        })

        if (taskId) {
          queryClient.invalidateQueries({
            queryKey: taskKeysFactory.detail(Number(taskId)),
          })
        } else if (currentRow?.id) {
          queryClient.invalidateQueries({
            queryKey: taskKeysFactory.detail(Number(currentRow.id)),
          })
        }
      },
    }
  )

  const deleteTaskAssignmentMutation = $queryClient.useMutation(
    'delete',
    '/api/assignments/{id}',
    {
      onMutate: async (variables: any) => {
        // Get the task ID from the variables
        const taskId = variables?.params?.path?.id
        if (!taskId) return {}

        // Cancel any outgoing refetches to avoid overwriting our optimistic update
        await queryClient.cancelQueries({
          queryKey: taskKeysFactory.lists(),
        })

        // Snapshot the previous value
        const previousTasks = queryClient.getQueryData(taskKeysFactory.lists())

        // Optimistically update by removing the task with the given ID
        queryClient.setQueryData(
          taskKeysFactory.lists(),
          (old: { data: Task[] }) => {
            if (!old?.data) return old

            return {
              ...old,
              data: old.data.map((task) => ({
                ...task,
                assignments: task.assignments?.filter(
                  (assignment) => assignment.assignmentId !== Number(taskId)
                ),
              })),
            }
          }
        )

        // Also remove the task detail if it's in the cache
        queryClient.removeQueries({
          queryKey: taskKeysFactory.detail(Number(taskId)),
        })

        return { previousTasks }
      },
      onError: (_, __, context: any) => {
        if (context?.previousTasks) {
          queryClient.setQueryData(
            taskKeysFactory.lists(),
            context.previousTasks
          )
        }

        let errorMessage = 'Failed to delete assignment'
        toast.error(errorMessage, {
          description:
            'Please try again or contact support if the problem persists.',
          duration: 5000,
        })
      },
      onSettled: () => {
        // Always refetch after error or success
        queryClient.invalidateQueries({
          queryKey: taskKeysFactory.lists(),
        })

        if (currentRow?.id) {
          queryClient.invalidateQueries({
            queryKey: taskKeysFactory.detail(Number(currentRow.id)),
          })
        }
      },
    }
  )

  const deleteTaskDocumentMutation = $queryClient.useMutation(
    'delete',
    '/api/task-documents/remove',
    {
      onMutate: async (variables: any) => {
        // Get the document ID from the variables
        const documentId = variables?.params?.query?.documentId
        const taskId = variables?.params?.query?.taskId
        if (!documentId || !taskId) return {}

        // Cancel any outgoing refetches to avoid overwriting our optimistic update
        await queryClient.cancelQueries({
          queryKey: taskKeysFactory.lists(),
        })

        // Snapshot the previous value
        const previousTasks = queryClient.getQueryData(taskKeysFactory.lists())

        // Optimistically update by removing the document with the given ID
        queryClient.setQueryData(
          taskKeysFactory.lists(),
          (old: { data: Task[] }) => {
            if (!old?.data) return old

            return {
              ...old,
              data: old.data.map((task) =>
                task.id === taskId
                  ? {
                      ...task,
                      documents: task.documents?.filter(
                        (document) => document.id !== documentId
                      ),
                    }
                  : task
              ),
            }
          }
        )

        // Also remove the task detail if it's in the cache
        queryClient.removeQueries({
          queryKey: taskKeysFactory.detail(taskId),
        })

        return { previousTasks }
      },
      onError: (_, __, context: any) => {
        if (context?.previousTasks) {
          queryClient.setQueryData(
            taskKeysFactory.lists(),
            context.previousTasks
          )
        }

        let errorMessage = 'Failed to delete document'
        toast.error(errorMessage, {
          description:
            'Please try again or contact support if the problem persists.',
          duration: 5000,
        })
      },
      onSettled: (_, variables: any) => {
        // Get the task ID from the variables
        const taskId = variables?.params?.query?.taskId

        // Always refetch after error or success
        queryClient.invalidateQueries({
          queryKey: taskKeysFactory.lists(),
        })

        if (taskId) {
          queryClient.invalidateQueries({
            queryKey: taskKeysFactory.detail(Number(taskId)),
          })
        } else if (currentRow?.id) {
          queryClient.invalidateQueries({
            queryKey: taskKeysFactory.detail(Number(currentRow.id)),
          })
        }
      },
    }
  )

  return (
    <>
      <TasksImportDialog
        key='tasks-import'
        open={open === 'import'}
        onOpenChange={() => {
          setOpen('import')
        }}
      />

      {currentRow && (
        <>
          <ViewAssignmentDialog
            key='view-assignment'
            open={open === 'view-assignment'}
            onOpenChange={() => {
              setOpen('view-assignment')
            }}
            currentRow={currentRow}
          />
          <ViewDocumentDialog
            key='view-document'
            open={open === 'view-document'}
            onOpenChange={() => {
              setOpen('view-document')
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key='task-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            isLoading={deleteTaskMutation.isPending}
            handleConfirm={async () => {
              const taskId = currentRow.id
              if (!taskId) {
                toast.error('Task ID is missing')
                return
              }
              const deleteTaskPromise = deleteTaskMutation.mutateAsync({
                params: {
                  path: { id: taskId },
                },
              })
              toast.promise(deleteTaskPromise, {
                loading: `Deleting task #${taskId}...`,
                success: `Task #${taskId} deleted successfully!`,
                error: `Failed to delete task #${taskId}. Please try again.`,
              })
              setOpen(null)
              setCurrentRow(null)
            }}
            className='max-w-md'
            title={`Delete Task #${currentRow.id}`}
            desc={
              <>
                You are about to delete task #{' '}
                <strong className='text-destructive font-medium'>
                  {currentRow.id}
                </strong>
                {currentRow.content && (
                  <>
                    :{' '}
                    <em className='font-normal'>
                      "{currentRow.content.substring(0, 40)}
                      {currentRow.content.length > 40 ? '...' : ''}"
                    </em>
                  </>
                )}
                <br />
                <span className='text-destructive mt-2 block font-semibold'>
                  This action cannot be undone.
                </span>
              </>
            }
            confirmText='Delete'
          />
        </>
      )}

      {currentAssignmentRow && (
        <ConfirmDialog
          key='assignment-delete'
          destructive
          open={open === 'delete-assignment'}
          onOpenChange={() => {
            setOpen('delete-assignment')
          }}
          isLoading={deleteTaskAssignmentMutation.isPending}
          handleConfirm={async () => {
            const assignmentId = currentAssignmentRow.assignmentId
            if (!assignmentId) {
              toast.error('Assignment ID is missing')
              return
            }
            const deleteAssignmentPromise =
              deleteTaskAssignmentMutation.mutateAsync({
                params: {
                  path: { id: assignmentId },
                },
              })
            toast.promise(deleteAssignmentPromise, {
              loading: `Deleting assignment #${assignmentId}...`,
              success: `Assignment #${assignmentId} deleted successfully!`,
              error: `Failed to delete assignment #${assignmentId}. Please try again.`,
            })
            setOpen(null)
            setCurrentAssignmentRow(null)
          }}
          className='max-w-md'
          title={`Delete Assignment #${currentAssignmentRow.assignmentId}`}
          desc={
            <>
              You are about to delete assignment #
              <strong className='text-destructive font-medium'>
                {currentAssignmentRow.assignmentId}
              </strong>
              <br />
              <span className='text-destructive mt-2 block font-semibold'>
                This action cannot be undone.
              </span>
            </>
          }
          confirmText='Delete'
        />
      )}

      {currentDocumentRow && (
        <ConfirmDialog
          key='document-delete'
          destructive
          open={open === 'delete-document'}
          onOpenChange={() => {
            setOpen('delete-document')
          }}
          isLoading={deleteTaskDocumentMutation.isPending}
          handleConfirm={async () => {
            const documentId = currentDocumentRow.id
            if (!documentId) {
              toast.error('Document ID is missing')
              return
            }
            const deleteDocumentPromise =
              deleteTaskDocumentMutation.mutateAsync({
                params: {
                  query: {
                    documentId: documentId,
                    taskId: Number(currentRow?.id!),
                  },
                },
              })
            toast.promise(deleteDocumentPromise, {
              loading: `Deleting document #${documentId}...`,
              success: `Document #${documentId} deleted successfully!`,
              error: `Failed to delete document #${documentId}. Please try again.`,
            })
            setOpen(null)
            setCurrentDocumentRow(null)
          }}
          className='max-w-md'
          title={`Delete Document #${currentDocumentRow.id}`}
          desc={
            <>
              You are about to delete document #
              <strong className='text-destructive font-medium'>
                {currentDocumentRow.id}
              </strong>
              <br />
              <span className='text-destructive mt-2 block font-semibold'>
                This action cannot be undone.
              </span>
            </>
          }
          confirmText='Delete'
        />
      )}
    </>
  )
}
