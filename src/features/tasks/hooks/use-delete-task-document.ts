import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { taskKeysFactory } from '@/api/query-key-factory'
import { TaskDocument } from '@/features/tasks/types'

export const useDeleteTaskDocumentMutation = (taskId: number | null) => {
  const queryClient = useQueryClient()

  return $queryClient.useMutation('delete', '/api/task-documents/remove', {
    onMutate: async (variables) => {
      if (!taskId) return

      const documentId = variables?.params?.query?.documentId

      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({
        queryKey: taskKeysFactory.documents(taskId),
      })

      const previousDocuments = queryClient.getQueryData<{
        data: TaskDocument[]
      }>(taskKeysFactory.documents(taskId))

      // Optimistically update to the new value
      if (previousDocuments?.data) {
        const filteredDocuments = previousDocuments.data.filter(
          (document) => document.id !== documentId
        )

        queryClient.setQueryData(taskKeysFactory.documents(taskId), {
          data: filteredDocuments,
        })
      }

      // Return a context object with the previous documents
      return { previousDocuments }
    },
    onError: (_, __, context: any) => {
      if (!taskId) return

      if (context?.previousDocuments) {
        queryClient.setQueryData(
          taskKeysFactory.documents(taskId),
          context.previousDocuments
        )
      }
    },
    onSettled: () => {
      if (!taskId) return

      // Invalidate queries to refetch the documents
      queryClient.invalidateQueries({
        queryKey: taskKeysFactory.documents(taskId),
      })
    },
  })
}
