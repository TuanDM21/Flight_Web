import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { documentKeysFactory } from '@/api/query-key-factory'

export const useCreateDocument = () => {
  const queryClient = useQueryClient()

  return $queryClient.useMutation('post', '/api/documents', {
    onMutate: async (variables) => {
      // Cancel any outgoing refetches to prevent them overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: documentKeysFactory.lists() })

      // Snapshot the current value
      const previousDocuments = queryClient.getQueryData(
        documentKeysFactory.lists()
      )

      // Optimistically update the list by adding the new document
      queryClient.setQueryData(documentKeysFactory.lists(), (old: any) => {
        if (!old?.data) return old

        // Create a temporary ID for the optimistic update
        const tempId = Date.now()
        const { documentType, content, notes } = variables?.body || {}

        const newDocumentData = {
          id: tempId,
          documentType: documentType || '',
          content: content || '',
          notes: notes || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          attachments: [], // Will be populated by server response
        }

        return {
          ...old,
          data: [newDocumentData, ...old.data],
        }
      })

      return { previousDocuments }
    },
    onError: (_, __, context: any) => {
      // Restore the previous state if available
      if (context?.previousDocuments) {
        queryClient.setQueryData(
          documentKeysFactory.lists(),
          context.previousDocuments
        )
      }
    },
    onSettled: () => {
      // Even with optimistic updates, we still need to invalidate queries
      // to ensure we have the server-generated ID and any other server-side changes
      queryClient.invalidateQueries({ queryKey: documentKeysFactory.lists() })
    },
  })
}
