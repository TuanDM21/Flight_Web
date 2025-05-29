import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { taskKeysFactory, documentKeysFactory } from '@/api/query-key-factory'
import { TaskDocument } from '../types'

export function useInsertBulkTaskDocuments() {
  const queryClient = useQueryClient()

  return $queryClient.useMutation('post', '/api/task-documents/attach-bulk', {
    onMutate: async (variables) => {
      const { taskId } = variables.params.query
      const documentIds = variables.body

      if (!taskId || !documentIds || documentIds.length === 0) return

      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({
        queryKey: documentKeysFactory.lists(),
      })

      // Get all documents to filter the ones being added
      const allDocuments = queryClient.getQueryData<{
        data: TaskDocument[]
      }>(documentKeysFactory.lists())

      const previousTaskDocuments = queryClient.getQueryData<{
        data: TaskDocument[]
      }>(taskKeysFactory.documents(taskId))

      // Filter documents that match the IDs being added
      const documentsToAdd =
        allDocuments?.data?.filter((doc) => documentIds.includes(doc.id!)) || []

      const updatedDocuments = [
        ...(previousTaskDocuments?.data || []),
        ...documentsToAdd,
      ]
      queryClient.setQueryData(taskKeysFactory.documents(taskId), {
        data: updatedDocuments,
      })

      return {
        previousTaskDocuments,
        taskId,
      }
    },
    onError: (_, __, context: any) => {
      const { taskId } = context?.previousTaskDocuments || {}
      if (!taskId) return

      // Rollback to the previous documents
      if (context?.previousTaskDocuments) {
        queryClient.setQueryData(
          taskKeysFactory.documents(taskId),
          context.previousTaskDocuments
        )
      }
    },
    onSettled: (_, __, variables) => {
      const { taskId } = variables.params.query

      // Invalidate queries to refetch the documents
      queryClient.invalidateQueries({
        queryKey: taskKeysFactory.documents(taskId),
      })
    },
  })
}
