import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { taskKeysFactory } from '@/api/query-key-factory'
import { TaskAssignment } from '@/features/tasks/types'

export const useUpdateAssignmentMutation = (taskId: number | undefined) => {
  const queryClient = useQueryClient()

  return $queryClient.useMutation('put', '/api/assignments/{id}', {
    onMutate: async (variables) => {
      if (!taskId) return {}

      const assignmentId = variables.params.path.id

      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: taskKeysFactory.assignments(taskId),
      })

      const previousTaskAssignments = queryClient.getQueryData(
        taskKeysFactory.assignments(taskId)
      ) as TaskAssignment[]

      // Optimistically update the assignments list
      queryClient.setQueryData(
        taskKeysFactory.assignments(taskId),
        (old: { data: TaskAssignment[] }) => {
          if (!old?.data) return old
          return {
            ...old,
            data: old.data.map((assignment) => {
              if (assignment.assignmentId === assignmentId) {
                return {
                  ...assignment,
                  ...variables.body,
                }
              }
              return assignment
            }),
          }
        }
      )

      return { previousTaskAssignments }
    },
    onError: (_, __, context: any) => {
      if (!taskId) return

      // Rollback to the previous state
      queryClient.setQueryData(
        taskKeysFactory.assignments(taskId),
        context?.previousTaskAssignments
      )
    },
    onSettled: () => {
      if (!taskId) return
      queryClient.invalidateQueries({
        queryKey: taskKeysFactory.assignments(taskId),
      })
    },
  })
}
