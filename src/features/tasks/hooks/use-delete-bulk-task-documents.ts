import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { taskKeysFactory } from '@/api/query-key-factory'
import { TaskDocument } from '@/features/tasks/types'

export const useDeleteBulkTaskDocumentsMutation = (taskId?: number | null) => {
  const queryClient = useQueryClient()

  return $queryClient.useMutation('delete', '/api/task-documents/remove-bulk', {
    onMutate: async (variables) => {
      const taskId = variables?.params?.query?.taskId
      const documentIds = variables?.body

      if (!taskId) return
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({
        queryKey: taskKeysFactory.documents(taskId),
      })

      const previousDocuments = queryClient.getQueryData<{
        data: TaskDocument[]
      }>(taskKeysFactory.documents(taskId))

      const filteredDocuments = previousDocuments?.data?.filter(
        (doc) => !documentIds?.includes(doc.id!)
      )

      // Optimistically update to the new value
      if (previousDocuments?.data) {
        queryClient.setQueryData(taskKeysFactory.documents(taskId), {
          data: filteredDocuments,
        })
      }

      // Return a context object with the previous documents
      return { previousDocuments }
    },
    onError: (_, __, context: any) => {
      const taskId = context?.taskId

      if (!taskId) return

      if (context?.previousDocuments) {
        queryClient.setQueryData(taskKeysFactory.documents(taskId), {
          data: context.previousDocuments,
        })
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
