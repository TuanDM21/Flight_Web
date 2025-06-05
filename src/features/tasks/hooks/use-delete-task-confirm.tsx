import { toast } from 'sonner'
import { useDialogs } from '@/hooks/use-dialogs'
import { Task, TaskFilterTypes } from '../types'
import { useDeleteTask } from './use-delete-task'

export const useTaskDeleteConfirm = (filterType: TaskFilterTypes) => {
  const dialogs = useDialogs()
  const deleteTaskMutation = useDeleteTask(filterType)

  const onDeleteTask = async (task: Task) => {
    const confirmed = await dialogs.confirm(
      <div className='space-y-2'>
        <p className='text-muted-foreground text-sm'>
          This will permanently delete task #{task.id} and all its associated
          data including:
        </p>
        <ul className='text-muted-foreground ml-2 list-inside list-disc space-y-1 text-sm'>
          <li>All assignments and their comments</li>
          <li>All attached documents</li>
          <li>Task history and progress</li>
        </ul>
        <p className='text-muted-foreground text-sm font-medium'>
          This action cannot be undone.
        </p>
      </div>,
      {
        title: `Delete Task #${task.id}`,
        severity: 'error',
        okText: 'Delete',
        cancelText: 'Cancel',
      }
    )

    if (confirmed) {
      const deleteTaskPromise = deleteTaskMutation.mutateAsync({
        params: {
          path: { id: task.id! },
        },
      })

      toast.promise(deleteTaskPromise, {
        loading: `Deleting task #${task.id}...`,
        success: () => {
          return `Successfully deleted task #${task.id}.`
        },
        error: `Failed to delete task #${task.id}. Please try again.`,
      })
    }
  }

  return { onDeleteTask }
}
