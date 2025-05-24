import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { taskKeysFactory } from '@/api/query-key-factory'
import { TaskAssignment } from '@/features/tasks/types'

export const useDeleteTaskAssignmentMutation = (taskId: number | null) => {
  const queryClient = useQueryClient()

  return $queryClient.useMutation('delete', '/api/assignments/{id}', {
    onMutate: async (data) => {
      const currentAssignmentId = data.params.path.id
      if (currentAssignmentId == null || taskId == null) return

      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: taskKeysFactory.assignments(taskId),
      })

      // Snapshot the previous value
      const previousTaskAssignments = queryClient.getQueryData<{
        data: TaskAssignment[]
      }>(taskKeysFactory.assignments(taskId))

      // Optimistically update to the new value
      queryClient.setQueryData<{
        data: TaskAssignment[]
      }>(taskKeysFactory.assignments(taskId), (old) => {
        if (!old?.data) return old

        return {
          ...old,
          data: old.data.filter(
            (assignment) => assignment.assignmentId !== currentAssignmentId
          ),
        }
      })

      return { previousTaskAssignments, currentAssignmentId }
    },
    onError: (_, __, context: any) => {
      if (!taskId) return

      queryClient.setQueryData(
        taskKeysFactory.assignments(taskId),
        context?.previousTaskAssignments
      )
    },
    onSettled: (_, __) => {
      if (!taskId) return

      queryClient.invalidateQueries({
        queryKey: taskKeysFactory.assignments(taskId),
      })
    },
  })
}
