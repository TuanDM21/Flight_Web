import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { BaseApiResponse } from '@/types/response'
import { taskKeysFactory } from '@/api/query-key-factory'
import { Task, TaskFilterTypes } from '@/features/tasks/types'

interface OptimisticUpdateContext {
  taskId: number
  previousTaskDetail?: BaseApiResponse<Task>
  previousTasksList?: BaseApiResponse<Task[]>
}

export const useUpdateTask = (filterType: TaskFilterTypes) => {
  const queryClient = useQueryClient()

  return $queryClient.useMutation('put', '/api/tasks/{id}', {
    onMutate: async (variables): Promise<OptimisticUpdateContext> => {
      // Get the task ID from the variables
      const taskId = variables?.params?.path?.id

      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({
        queryKey: taskKeysFactory.detail(Number(taskId)),
      })
      await queryClient.cancelQueries({
        queryKey: taskKeysFactory.listAssignees(filterType),
      })

      // Snapshot the previous values
      const previousTaskDetail = queryClient.getQueryData<
        BaseApiResponse<Task>
      >(taskKeysFactory.detail(Number(taskId)))
      const previousTasksList = queryClient.getQueryData<
        BaseApiResponse<Task[]>
      >(taskKeysFactory.listAssignees(filterType))

      // Extract the updated data
      const { content, instructions, notes } = variables?.body || {}

      // Optimistically update the task detail
      queryClient.setQueryData(
        taskKeysFactory.detail(Number(taskId)),
        (old: BaseApiResponse<Task> | undefined) => {
          if (!old?.data) return old

          return {
            ...old,
            data: {
              ...old.data,
              content,
              instructions,
              notes,
              updatedAt: new Date().toISOString(),
            },
          }
        }
      )

      // Optimistically update the tasks list
      queryClient.setQueryData(
        taskKeysFactory.listAssignees(filterType),
        (old: BaseApiResponse<Task[]> | undefined) => {
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
                    updatedAt: new Date().toISOString(),
                  }
                : task
            ),
          }
        }
      )

      // Return the previous values so we can revert if something goes wrong
      return {
        taskId: Number(taskId),
        previousTaskDetail,
        previousTasksList,
      }
    },
    onError: (_error, _variables, context) => {
      const typedContext = context as OptimisticUpdateContext | undefined
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
    onSettled: (_data, _error, variables, context) => {
      const typedContext = context as OptimisticUpdateContext | undefined
      const taskId = variables?.params?.path?.id ?? typedContext?.taskId

      if (!taskId) return

      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: taskKeysFactory.listAssignees(filterType),
      })

      queryClient.invalidateQueries({
        queryKey: taskKeysFactory.detail(Number(taskId)),
      })
    },
  })
}
