import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { BaseApiResponse } from '@/types/response'
import { attachmentKeysFactory } from '@/api/query-key-factory'
import { AttachmentItem } from '../types'

interface OptimisticDeleteContext {
  previousAttachments: BaseApiResponse<AttachmentItem[]> | undefined
}

export const useDeleteAttachments = () => {
  const queryClient = useQueryClient()

  return $queryClient.useMutation('delete', '/api/attachments/bulk-delete', {
    onMutate: async (variables) => {
      const { attachmentIds } = variables.body
      await queryClient.cancelQueries({
        queryKey: attachmentKeysFactory.myAttachments(),
      })

      const previousAttachments = queryClient.getQueryData<
        BaseApiResponse<AttachmentItem[]>
      >(attachmentKeysFactory.myAttachments())

      if (previousAttachments?.data) {
        const remainingAttachments = previousAttachments.data.filter(
          (att) => !attachmentIds.includes(att.id!)
        )
        queryClient.setQueryData<BaseApiResponse<AttachmentItem[]>>(
          attachmentKeysFactory.myAttachments(),
          { ...previousAttachments, data: remainingAttachments }
        )
      }

      return { previousAttachments }
    },
    onError: (_, __, context) => {
      const typedContext = context as OptimisticDeleteContext
      if (typedContext?.previousAttachments) {
        queryClient.setQueryData<BaseApiResponse<AttachmentItem[]>>(
          attachmentKeysFactory.myAttachments(),
          typedContext.previousAttachments
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: attachmentKeysFactory.myAttachments(),
      })
    },
  })
}
