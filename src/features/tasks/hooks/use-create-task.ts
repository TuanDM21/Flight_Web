import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { taskKeysFactory } from '@/api/query-key-factory'

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient()

  return $queryClient.useMutation('post', '/api/tasks', {
    onMutate: async (variables) => {
      // Cancel any outgoing refetches to prevent them overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: taskKeysFactory.lists() })

      // Snapshot the current value
      const previousTasks = queryClient.getQueryData(taskKeysFactory.lists())

      // Optimistically update the list by adding the new task
      queryClient.setQueryData(taskKeysFactory.lists(), (old: any) => {
        if (!old?.data) return old

        // Create a temporary ID for the optimistic update
        const tempId = Date.now()
        const { content, instructions, notes } = variables?.body || {}

        const newTaskData = {
          id: tempId,
          content,
          instructions,
          notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          // Add any other required fields with default values that might be needed
        }

        return {
          ...old,
          data: [newTaskData, ...old.data],
        }
      })

      return { previousTasks }
    },
    onError: (_, __, context: any) => {
      // Restore the previous state if available
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeysFactory.lists(), context.previousTasks)
      }
    },
    onSettled: () => {
      // Even with optimistic updates, we still need to invalidate queries
      // to ensure we have the server-generated ID and any other server-side changes
      queryClient.invalidateQueries({ queryKey: taskKeysFactory.lists() })
    },
  })
}
