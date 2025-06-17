import { toast } from 'sonner'
import { useDialogs } from '@/hooks/use-dialogs'
import { Task, TaskFilterTypes } from '../types'
import { useDeleteTasks } from './use-delete-tasks'

export const useDeleteTasksConfirm = (filterType: TaskFilterTypes) => {
  const dialogs = useDialogs()
  const deleteTasksMutation = useDeleteTasks(filterType)

  const onDeleteTasks = async (tasks: Task[]) => {
    if (tasks.length === 0) return

    const taskIds = tasks.map((task) => task.id!).filter(Boolean)
    const taskCount = taskIds.length

    const confirmed = await dialogs.confirm(
      <div className='space-y-2'>
        <p className='text-muted-foreground text-sm'>
          This will permanently delete {taskCount} task
          {taskCount > 1 ? 's' : ''} and all their associated data including:
        </p>
        <ul className='text-muted-foreground ml-2 list-inside list-disc space-y-1 text-sm'>
          <li>All assignments and their comments</li>
          <li>All attached documents</li>
          <li>Task history and progress</li>
        </ul>
        <div className='text-muted-foreground text-sm'>
          <p className='mb-1 font-medium'>Tasks to be deleted:</p>
          <div className='max-h-32 overflow-y-auto text-xs'>
            {tasks.slice(0, 10).map((task) => (
              <div key={task.id}>
                #{task.id} - {task.content}
              </div>
            ))}
            {tasks.length > 10 && (
              <div className='text-muted-foreground italic'>
                ...and {tasks.length - 10} more
              </div>
            )}
          </div>
        </div>
        <p className='text-muted-foreground text-sm font-medium'>
          This action cannot be undone.
        </p>
      </div>,
      {
        title: `Delete ${taskCount} Task${taskCount > 1 ? 's' : ''}`,
        severity: 'error',
        okText: 'Delete All',
        cancelText: 'Cancel',
      }
    )

    if (confirmed) {
      const deleteTasksPromise = deleteTasksMutation.mutateAsync({
        body: {
          taskIds,
        },
      })

      toast.promise(deleteTasksPromise, {
        loading: `Đang xóa ${taskCount} nhiệm vụ...`,
        success: () => {
          return `Đã xóa thành công ${taskCount} nhiệm vụ.`
        },
        error: `Không thể xóa các nhiệm vụ. Vui lòng thử lại.`,
      })
    }
  }

  return {
    onDeleteTasks,
    isDeleting: deleteTasksMutation.isPending,
  }
}
