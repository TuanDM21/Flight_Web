import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { BaseApiResponse } from '@/types/response'
import { documentKeysFactory } from '@/api/query-key-factory'
import { DocumentItem } from '../types'

interface OptimisticUpdateContext {
  documentId: number
  previousDocuments?: BaseApiResponse<DocumentItem[]>
  previousDocumentDetail?: BaseApiResponse<DocumentItem>
}

export const useUpdateDocument = () => {
  const queryClient = useQueryClient()
  return $queryClient.useMutation('put', '/api/documents/{id}', {
    onMutate: async (data): Promise<OptimisticUpdateContext> => {
      const documentId = data.params.path.id

      // Cancel any outgoing refetches to prevent them overwriting our optimistic update
      await queryClient.cancelQueries({
        queryKey: documentKeysFactory.lists(),
      })
      await queryClient.cancelQueries({
        queryKey: documentKeysFactory.detail(documentId),
      })

      // Snapshot the current documents
      const previousDocuments = queryClient.getQueryData<
        BaseApiResponse<DocumentItem[]>
      >(documentKeysFactory.lists())

      // Snapshot the current document detail
      const previousDocumentDetail = queryClient.getQueryData<
        BaseApiResponse<DocumentItem>
      >(documentKeysFactory.detail(documentId))

      // Optimistically update the list by modifying the document
      queryClient.setQueryData<BaseApiResponse<DocumentItem[]>>(
        documentKeysFactory.lists(),
        (old) => {
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

      // Optimistically update the document detail
      queryClient.setQueryData<BaseApiResponse<DocumentItem>>(
        documentKeysFactory.detail(documentId),
        (old) => {
          if (!old?.data) return old

          return {
            ...old,
            data: {
              ...old.data,
              ...data.body,
              updatedAt: new Date().toISOString(),
            },
          }
        }
      )

      return {
        documentId,
        previousDocuments,
        previousDocumentDetail,
      }
    },
    onError: (_error, _variables, context) => {
      const typedContext = context as OptimisticUpdateContext | undefined
      if (!typedContext) return

      // Restore the previous state if available
      if (typedContext.previousDocuments) {
        queryClient.setQueryData(
          documentKeysFactory.lists(),
          typedContext.previousDocuments
        )
      }

      if (typedContext.previousDocumentDetail) {
        queryClient.setQueryData(
          documentKeysFactory.detail(typedContext.documentId),
          typedContext.previousDocumentDetail
        )
      }
    },
    onSettled: (_data, _error, _variables, context) => {
      const typedContext = context as OptimisticUpdateContext

      // Invalidate queries to ensure we have the latest server state
      queryClient.invalidateQueries({ queryKey: documentKeysFactory.lists() })
      queryClient.invalidateQueries({
        queryKey: documentKeysFactory.detail(typedContext.documentId),
      })
    },
  })
}
