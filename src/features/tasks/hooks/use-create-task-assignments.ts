import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { taskKeysFactory } from '@/api/query-key-factory'
import { TaskAssignment } from '../types'

export function useCreateTaskAssignmentsMutation() {
  const queryClient = useQueryClient()
  return $queryClient.useMutation('post', '/api/assignments', {
    onMutate: async (variables) => {
      // Extract the updated data
      const { assignments, taskId } = variables?.body || {}
      if (!taskId) return {}

      await queryClient.cancelQueries({
        queryKey: taskKeysFactory.assignments(taskId),
      })

      const previousTaskAssignments = queryClient.getQueryData(
        taskKeysFactory.assignments(taskId)
      )

      // Optimistically update the assignments list
      queryClient.setQueryData(
        taskKeysFactory.assignments(taskId),
        (old: { data: TaskAssignment[] }) => {
          if (!old?.data) return old
          return {
            ...old,
            data: [...old.data, ...(assignments || [])],
          }
        }
      )

      return {
        previousTaskAssignments,
        taskId,
      }
    },
    onError: (_err, _data, context: any) => {
      const taskId = context?.taskId
      // Rollback to the previous state
      queryClient.setQueryData(
        taskKeysFactory.assignments(taskId),
        context?.previousTaskAssignments
      )
    },
    onSettled: (_, __, variables) => {
      const taskId = variables?.body?.taskId
      if (!taskId) return
      queryClient.invalidateQueries({
        queryKey: taskKeysFactory.assignments(taskId),
      })
    },
  })
}
