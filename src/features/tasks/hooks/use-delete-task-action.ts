import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useDialogs } from '@/hooks/use-dialogs'

export const useDeleteTaskAction = () => {
  const dialogs = useDialogs()
  const navigate = useNavigate()

  const deleteTask = async (taskId: number) => {
    const confirmed = await dialogs.confirm(
      React.createElement(
        'div',
        null,
        React.createElement(
          'p',
          null,
          'Are you sure you want to delete this task?'
        ),
        React.createElement(
          'p',
          { className: 'text-muted-foreground mt-2 text-sm' },
          'This action cannot be undone. All data associated with this task will be permanently removed.'
        )
      ),
      {
        title: 'Delete Task',
        okText: 'Delete',
        cancelText: 'Cancel',
        severity: 'error',
      }
    )

    if (confirmed) {
      // TODO: Implement actual task deletion API call
      console.log('Deleting task:', taskId)
      navigate({ to: '/tasks' })
    }
  }

  return { deleteTask }
}
