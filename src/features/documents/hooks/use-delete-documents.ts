import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { BaseApiResponse } from '@/types/response'
import { documentKeysFactory } from '@/api/query-key-factory'
import { DocumentItem } from '../types'

interface OptimisticDeleteContext {
  previousDocuments: BaseApiResponse<DocumentItem[]> | undefined
}

export const useDeleteDocuments = () => {
  const queryClient = useQueryClient()

  return $queryClient.useMutation('delete', '/api/documents/{id}', {
    onMutate: async (data): Promise<OptimisticDeleteContext> => {
      const { id } = data.params.path

      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({
        queryKey: documentKeysFactory.lists(),
      })

      // Snapshot the previous value for rollback
      const previousDocuments = queryClient.getQueryData<
        BaseApiResponse<DocumentItem[]>
      >(documentKeysFactory.lists())

      // Optimistically remove the document from the cache
      if (previousDocuments?.data) {
        const filteredDocuments = previousDocuments.data.filter(
          (doc) => doc.id !== id
        )

        queryClient.setQueryData<BaseApiResponse<DocumentItem[]>>(
          documentKeysFactory.lists(),
          { ...previousDocuments, data: filteredDocuments }
        )
      }

      return { previousDocuments }
    },

    onError: (_, __, context) => {
      // Rollback to the previous state if mutation fails
      const typedContext = context as OptimisticDeleteContext | undefined

      if (typedContext?.previousDocuments) {
        queryClient.setQueryData<BaseApiResponse<DocumentItem[]>>(
          documentKeysFactory.lists(),
          typedContext.previousDocuments
        )
      }
    },

    onSettled: () => {
      // Always refetch after error or success to ensure data consistency
      queryClient.invalidateQueries({
        queryKey: documentKeysFactory.lists(),
      })
    },
  })
}
