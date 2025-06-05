import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { BaseApiResponse } from '@/types/response'
import { documentKeysFactory } from '@/api/query-key-factory'
import { DocumentItem } from '../types'

export function useUnlinkAttachmentsFromDocument() {
  const queryClient = useQueryClient()

  return $queryClient.useMutation(
    'patch',
    '/api/documents/{documentId}/attachments/remove',
    {
      onMutate: async ({ params, body }) => {
        const { documentId } = params.path
        await queryClient.cancelQueries({
          queryKey: documentKeysFactory.detail(documentId),
        })

        const previousDocument = queryClient.getQueryData<
          BaseApiResponse<DocumentItem>
        >(documentKeysFactory.detail(documentId))

        queryClient.setQueryData<BaseApiResponse<DocumentItem>>(
          documentKeysFactory.detail(documentId),
          (oldData) => {
            if (!oldData) return oldData
            const updatedDocument = {
              ...oldData,
              data: {
                ...oldData.data,
                attachments: oldData?.data?.attachments?.filter(
                  (attachment) => !body.attachmentIds.includes(attachment.id!)
                ),
              },
            }
            return updatedDocument
          }
        )

        return { previousDocument }
      },
      onError: (_, { params }, context: any) => {
        const { documentId } = params.path
        queryClient.setQueryData<BaseApiResponse<DocumentItem>>(
          documentKeysFactory.detail(documentId),
          context?.previousDocument
        )
      },
      onSettled: (_, __, { params }) => {
        const { documentId } = params.path
        queryClient.invalidateQueries({
          queryKey: documentKeysFactory.detail(documentId),
        })
      },
    }
  )
}
