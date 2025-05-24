import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { BaseApiResponse } from '@/types/response'
import { documentKeysFactory } from '@/api/query-key-factory'
import { DocumentItem } from '../types'

export const useUpdateDocument = () => {
  const queryClient = useQueryClient()
  return $queryClient.useMutation('put', '/api/documents/{id}', {
    onMutate: async (data) => {
      const documentId = data.params.path.id
      // Cancel any outgoing refetches to prevent them overwriting our optimistic update
      await queryClient.cancelQueries({
        queryKey: documentKeysFactory.lists(),
      })
      // Snapshot the current value
      const previousDocuments = queryClient.getQueryData<
        BaseApiResponse<DocumentItem[]>
      >(documentKeysFactory.lists())

      // Optimistically update the list by modifying the document
      queryClient.setQueryData(
        documentKeysFactory.lists(),
        (old: BaseApiResponse<DocumentItem[]> | undefined) => {
          if (!old?.data) return old

          const updatedData = old.data.map((document) => {
            if (document.id === documentId) {
              return {
                ...document,
                ...data.body,
                updatedAt: new Date().toISOString(),
              }
            }
            return document
          })

          return {
            ...old,
            data: updatedData,
          }
        }
      )

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
      // Invalidate queries to ensure we have the latest server state
      queryClient.invalidateQueries({ queryKey: documentKeysFactory.lists() })
    },
  })
}
