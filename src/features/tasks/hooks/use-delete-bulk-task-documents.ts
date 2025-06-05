import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { BaseApiResponse } from '@/types/response'
import { taskKeysFactory } from '@/api/query-key-factory'
import { TaskDocument } from '@/features/tasks/types'

interface OptimisticBulkDeleteContext {
  taskId: number
  previousDocuments?: BaseApiResponse<TaskDocument[]>
}

export const useDeleteBulkTaskDocuments = () => {
  const queryClient = useQueryClient()

  return $queryClient.useMutation('delete', '/api/task-documents/remove-bulk', {
    onMutate: async (variables): Promise<OptimisticBulkDeleteContext> => {
      const taskId = variables?.params?.query?.taskId
      const documentIds = variables?.body

      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({
        queryKey: taskKeysFactory.documents(taskId),
      })

      const previousTaskDocuments = queryClient.getQueryData<
        BaseApiResponse<TaskDocument[]>
      >(taskKeysFactory.documents(taskId))

      // Optimistically update to the new value
      if (previousTaskDocuments?.data) {
        const filteredDocuments = previousTaskDocuments?.data?.filter(
          (doc) => !documentIds?.includes(doc.id!)
        )
        queryClient.setQueryData(taskKeysFactory.documents(taskId), {
          ...previousTaskDocuments,
          data: filteredDocuments,
        })
      }

      // Return a context object with the previous documents
      return {
        taskId: Number(taskId),
        previousDocuments: previousTaskDocuments,
      }
    },
    onError: (_error, _variables, context) => {
      const typedContext = context as OptimisticBulkDeleteContext | undefined
      if (!typedContext) return

      if (typedContext.previousDocuments) {
        queryClient.setQueryData(
          taskKeysFactory.documents(typedContext.taskId),
          typedContext.previousDocuments
        )
      }
    },
    onSettled: (_data, _error, _variables, context) => {
      const typedContext = context as OptimisticBulkDeleteContext | undefined
      const taskId = typedContext?.taskId

      // Invalidate queries to refetch the documents
      queryClient.invalidateQueries({
        queryKey: taskKeysFactory.documents(Number(taskId)),
      })
    },
  })
}
