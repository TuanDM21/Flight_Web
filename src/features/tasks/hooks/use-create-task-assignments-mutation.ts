import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { taskKeysFactory } from '@/api/query-key-factory'
import { Task } from '@/features/tasks/types'

export function useCreateTaskAssignmentsMutation(taskId?: number) {
  const queryClient = useQueryClient()
  return $queryClient.useMutation('post', '/api/assignments', {
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: taskKeysFactory.lists() })
      if (taskId) {
        await queryClient.cancelQueries({
          queryKey: taskKeysFactory.detail(taskId),
        })
      }

      // Snapshot previous values
      const previousTasks = queryClient.getQueryData(taskKeysFactory.lists())
      const previousTaskDetail = taskId
        ? queryClient.getQueryData(taskKeysFactory.detail(taskId))
        : undefined

      const assignmentData = variables?.body || variables

      // Optimistically update lists
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
                    assignments: [...(task.assignments || []), assignmentData],
                  }
                : task
            ),
          }
        }
      )

      // Optimistically update detail
      if (taskId && previousTaskDetail && (previousTaskDetail as any).data) {
        const prevDetail = previousTaskDetail as { data: Task }
        queryClient.setQueryData(taskKeysFactory.detail(taskId), {
          ...prevDetail,
          data: {
            ...prevDetail.data,
            assignments: [
              ...(prevDetail.data.assignments || []),
              assignmentData,
            ],
          },
        })
      }

      return { previousTasks, previousTaskDetail }
    },
    onError: (_err, _data, context: any) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeysFactory.lists(), context.previousTasks)
      }
      if (context?.previousTaskDetail && taskId) {
        queryClient.setQueryData(
          taskKeysFactory.detail(taskId),
          context.previousTaskDetail
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeysFactory.lists() })
      if (taskId) {
        queryClient.invalidateQueries({
          queryKey: taskKeysFactory.detail(taskId),
        })
      }
    },
  })
}
