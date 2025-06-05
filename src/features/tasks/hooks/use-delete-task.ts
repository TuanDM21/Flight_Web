import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { BaseApiResponse } from '@/types/response'
import { taskKeysFactory } from '@/api/query-key-factory'
import { Task, TaskFilterTypes } from '@/features/tasks/types'

interface OptimisticDeleteContext {
  taskId: number
  previousTaskDetail?: BaseApiResponse<Task>
  previousTasksList?: BaseApiResponse<Task[]>
}

export const useDeleteTask = (filterType: TaskFilterTypes) => {
  const queryClient = useQueryClient()

  return $queryClient.useMutation('delete', '/api/tasks/{id}', {
    meta: {
      invalidatesQuery: [
        taskKeysFactory.listAssignees(filterType),
        taskKeysFactory.detail,
      ],
    },
    onMutate: async (variables): Promise<OptimisticDeleteContext> => {
      // Get the task ID from the variables
      const taskId = variables?.params?.path?.id
      if (!taskId) {
        return { taskId: 0 }
      }

      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({
        queryKey: taskKeysFactory.listAssignees(filterType),
      })
      await queryClient.cancelQueries({
        queryKey: taskKeysFactory.detail(Number(taskId)),
      })

      // Snapshot the previous values
      const previousTaskDetail = queryClient.getQueryData<
        BaseApiResponse<Task>
      >(taskKeysFactory.detail(Number(taskId)))
      const previousTasksList = queryClient.getQueryData<
        BaseApiResponse<Task[]>
      >(taskKeysFactory.listAssignees(filterType))

      // Optimistically update by removing the task with the given ID
      queryClient.setQueryData(
        taskKeysFactory.listAssignees(filterType),
        (old: BaseApiResponse<Task[]> | undefined) => {
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

      // Return the previous values so we can revert if something goes wrong
      return {
        taskId: Number(taskId),
        previousTaskDetail,
        previousTasksList,
      }
    },
    onError: (_error, _variables, context) => {
      const typedContext = context as OptimisticDeleteContext | undefined
      if (!typedContext) return

      if (typedContext.previousTasksList) {
        queryClient.setQueryData(
          taskKeysFactory.listAssignees(filterType),
          typedContext.previousTasksList
        )
      }

      if (typedContext.previousTaskDetail) {
        queryClient.setQueryData(
          taskKeysFactory.detail(typedContext.taskId),
          typedContext.previousTaskDetail
        )
      }
    },
  })
}
