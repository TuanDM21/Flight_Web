import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { BaseApiResponse } from '@/types/response'
import { documentKeysFactory } from '@/api/query-key-factory'
import { DocumentItem } from '../types'

export const useDeleteDocuments = () => {
  const queryClient = useQueryClient()
  return $queryClient.useMutation('delete', '/api/documents/{id}', {
    onMutate: async (data) => {
      const { id } = data.params.path
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({
        queryKey: documentKeysFactory.lists(),
      })

      // Optimistically update the cache
      const previousDocuments = queryClient.getQueryData<
        BaseApiResponse<DocumentItem[]>
      >(documentKeysFactory.lists())

      const filteredDocuments =
        previousDocuments?.data.filter((doc) => doc.id !== id) ?? []

      queryClient.setQueryData<BaseApiResponse<DocumentItem[]>>(
        documentKeysFactory.lists(),
        previousDocuments
          ? { ...previousDocuments, data: filteredDocuments }
          : undefined
      )

      return { previousDocuments }
    },

    onError: (_, __, context: any) => {
      if (context?.previousDocuments) {
        queryClient.setQueryData(
          documentKeysFactory.lists(),
          context.previousDocuments
        )
      }
    },

    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: documentKeysFactory.lists(),
      })
    },
  })
}
