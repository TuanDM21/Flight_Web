import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { BaseApiResponse } from '@/types/response'
import { taskKeysFactory } from '@/api/query-key-factory'
import { Task } from '../types'

export const useCreateTask = (filterType = 'assigned') => {
  const queryClient = useQueryClient()
  return $queryClient.useMutation('post', '/api/tasks', {
    meta: {
      invalidatesQuery: [taskKeysFactory.listAssignees(filterType)],
    },
    onMutate: async (variables) => {
      // Cancel any outgoing refetches to prevent them overwriting our optimistic update
      await queryClient.cancelQueries({
        queryKey: taskKeysFactory.listAssignees(filterType),
      })
      // Snapshot the current value
      const previousTasks = queryClient.getQueryData<BaseApiResponse<Task[]>>(
        taskKeysFactory.listAssignees(filterType)
      )
      // Optimistically update the list by adding the new task
      queryClient.setQueryData<BaseApiResponse<Task[]>>(
        taskKeysFactory.listAssignees(filterType),
        (old: any) => {
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
        }
      )
      return { previousTasks }
    },
    onError: (_, __, context: any) => {
      // Restore the previous state if available
      if (context?.previousTasks) {
        queryClient.setQueryData(
          taskKeysFactory.listAssignees(filterType),
          context.previousTasks
        )
      }
    },
  })
}
