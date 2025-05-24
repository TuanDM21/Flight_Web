import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { BaseApiResponse } from '@/types/response'
import { documentKeysFactory } from '@/api/query-key-factory'
import { DocumentItem } from '../types'

interface OptimisticCreateContext {
  previousDocuments: BaseApiResponse<DocumentItem[]> | undefined
}

export const useCreateDocument = () => {
  const queryClient = useQueryClient()

  return $queryClient.useMutation('post', '/api/documents', {
    onMutate: async (variables): Promise<OptimisticCreateContext> => {
      // Cancel any outgoing refetches to prevent them overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: documentKeysFactory.lists() })

      // Snapshot the current value for rollback
      const previousDocuments = queryClient.getQueryData<
        BaseApiResponse<DocumentItem[]>
      >(documentKeysFactory.lists())

      // Optimistically update the list by adding the new document
      if (previousDocuments?.data) {
        // Create a temporary ID for the optimistic update
        const tempId = Date.now()
        const { documentType, content, notes } = variables?.body || {}

        const newDocumentData: DocumentItem = {
          id: tempId,
          documentType: documentType || '',
          content: content || '',
          notes: notes || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          attachments: [], // Will be populated by server response
        }

        queryClient.setQueryData<BaseApiResponse<DocumentItem[]>>(
          documentKeysFactory.lists(),
          {
            ...previousDocuments,
            data: [newDocumentData, ...previousDocuments.data],
          }
        )
      }

      return { previousDocuments }
    },

    onError: (_, __, context) => {
      // Rollback to the previous state if mutation fails
      const typedContext = context as OptimisticCreateContext | undefined

      if (typedContext?.previousDocuments) {
        queryClient.setQueryData<BaseApiResponse<DocumentItem[]>>(
          documentKeysFactory.lists(),
          typedContext.previousDocuments
        )
      }
    },

    onSettled: () => {
      // Always refetch to ensure we have the server-generated ID and server-side changes
      queryClient.invalidateQueries({ queryKey: documentKeysFactory.lists() })
    },
  })
}
