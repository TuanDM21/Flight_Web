import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { taskKeysFactory } from '@/api/query-key-factory'
import { Task } from '@/features/tasks/types'

export const useDeleteTask = () => {
  const queryClient = useQueryClient()

  return $queryClient.useMutation('delete', '/api/tasks/{id}', {
    onMutate: async (variables) => {
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
    onError: (_, __, context: any) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeysFactory.lists(), context.previousTasks)
      }
    },
    onSettled: (_, __, variables) => {
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
      } else if (taskId) {
        queryClient.invalidateQueries({
          queryKey: taskKeysFactory.detail(Number(taskId)),
        })
      }
    },
  })
}
