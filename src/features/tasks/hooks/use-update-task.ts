import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { taskKeysFactory } from '@/api/query-key-factory'
import { Task } from '@/features/tasks/types'

export const useUpdateTaskMutation = (currentTaskId?: number | null) => {
  const queryClient = useQueryClient()

  return $queryClient.useMutation('put', '/api/tasks/{id}', {
    onMutate: async (variables) => {
      // Get the task ID from the variables
      const taskId = variables?.params?.path?.id
      if (!taskId) return {}

      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({
        queryKey: taskKeysFactory.detail(Number(taskId)),
      })
      await queryClient.cancelQueries({
        queryKey: taskKeysFactory.lists(),
      })

      // Snapshot the previous values
      const previousTaskDetail = queryClient.getQueryData(
        taskKeysFactory.detail(Number(taskId))
      )
      const previousTasksList = queryClient.getQueryData(
        taskKeysFactory.lists()
      )

      // Extract the updated data
      const { content, instructions, notes } = variables?.body || {}

      // Optimistically update the task detail
      queryClient.setQueryData(
        taskKeysFactory.detail(Number(taskId)),
        (old: any) => {
          if (!old) return old

          return {
            ...old,
            data: {
              ...old.data,
              content,
              instructions,
              notes,
            },
          }
        }
      )

      // Optimistically update the tasks list
      queryClient.setQueryData(taskKeysFactory.lists(), (old: any) => {
        if (!old?.data) return old

        return {
          ...old,
          data: old.data.map((task: Task) =>
            task.id === Number(taskId)
              ? {
                  ...task,
                  content,
                  instructions,
                  notes,
                }
              : task
          ),
        }
      })

      // Return the previous values so we can revert if something goes wrong
      return { previousTaskDetail, previousTasksList }
    },
    onError: (_, __, context: any) => {
      if (context?.previousTasksList) {
        queryClient.setQueryData(
          taskKeysFactory.lists(),
          context.previousTasksList
        )
      }

      if (context?.previousTaskDetail) {
        const taskId = context.taskId ?? currentTaskId
        if (taskId) {
          queryClient.setQueryData(
            taskKeysFactory.detail(Number(taskId)),
            context.previousTaskDetail
          )
        }
      }
    },
    onSettled: (_, __, variables) => {
      const taskId = variables?.params?.path?.id ?? currentTaskId

      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: taskKeysFactory.lists(),
      })

      queryClient.invalidateQueries({
        queryKey: taskKeysFactory.detail(Number(taskId)),
      })
    },
  })
}
