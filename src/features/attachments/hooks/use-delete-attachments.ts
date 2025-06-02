import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { BaseApiResponse } from '@/types/response'
import { attachmentKeysFactory } from '@/api/query-key-factory'
import { MyAttachmentItem } from '../types'

interface OptimisticDeleteContext {
  previousAttachments: BaseApiResponse<MyAttachmentItem[]> | undefined
}

export const useDeleteAttachments = () => {
  const queryClient = useQueryClient()

  return $queryClient.useMutation('delete', '/api/attachments/bulk-delete', {
    onMutate: async (variables) => {
      const { attachmentIds } = variables.body
      await queryClient.cancelQueries({
        queryKey: attachmentKeysFactory.myFiles(),
      })

      const previousAttachments = queryClient.getQueryData<
        BaseApiResponse<MyAttachmentItem[]>
      >(attachmentKeysFactory.myFiles())

      if (previousAttachments?.data) {
        const remainingAttachments = previousAttachments.data.filter(
          (att) => !attachmentIds.includes(att.id!)
        )
        queryClient.setQueryData<BaseApiResponse<MyAttachmentItem[]>>(
          attachmentKeysFactory.myFiles(),
          { ...previousAttachments, data: remainingAttachments }
        )
      }

      return { previousAttachments }
    },
    onError: (_, __, context) => {
      const typedContext = context as OptimisticDeleteContext
      if (typedContext?.previousAttachments) {
        queryClient.setQueryData<BaseApiResponse<MyAttachmentItem[]>>(
          attachmentKeysFactory.myFiles(),
          typedContext.previousAttachments
        )
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: attachmentKeysFactory.myFiles(),
      })
    },
  })
}
