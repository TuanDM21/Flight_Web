import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { BaseApiResponse } from '@/types/response'
import { taskKeysFactory, documentKeysFactory } from '@/api/query-key-factory'
import { Task, TaskDocument, TaskFilterTypes } from '../types'

export function useInsertBulkTaskDocuments(filterType: TaskFilterTypes) {
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
      await queryClient.cancelQueries({
        queryKey: taskKeysFactory.listAssignees(filterType),
      })

      // Get all documents to filter the ones being added
      const allDocuments = queryClient.getQueryData<{
        data: TaskDocument[]
      }>(documentKeysFactory.lists())

      const previousTaskDocuments = queryClient.getQueryData<{
        data: TaskDocument[]
      }>(taskKeysFactory.documents(taskId))

      const allTasksAssignees = queryClient.getQueryData<
        BaseApiResponse<Task[]>
      >(taskKeysFactory.listAssignees(filterType))

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
      queryClient.setQueryData(taskKeysFactory.listAssignees(filterType), {
        data: allTasksAssignees?.data?.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              documents: updatedDocuments,
            }
          }
          return task
        }),
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

      queryClient.invalidateQueries({
        queryKey: taskKeysFactory.listAssignees(filterType),
      })
    },
  })
}
