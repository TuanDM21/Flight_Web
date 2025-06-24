import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { BaseApiResponse } from '@/types/response'
import { attachmentKeysFactory } from '@/api/query-key-factory'
import { AttachmentItem, SharedAttachmentUserItem } from '../types'

interface OptimisticRevokeContext {
  previousSharedUsers?: BaseApiResponse<SharedAttachmentUserItem[]>
  previousMyFiles?: BaseApiResponse<AttachmentItem[]>
}

export const useRevokeAttachmentAccess = () => {
  const queryClient = useQueryClient()

  return $queryClient.useMutation(
    'delete',
    '/api/attachments/shares/bulk-revoke-users',
    {
      onMutate: async (variables): Promise<OptimisticRevokeContext> => {
        const { attachmentId, userIds } = variables.body

        // Cancel any outgoing refetches to avoid overwriting our optimistic update
        await queryClient.cancelQueries({
          queryKey:
            attachmentKeysFactory.usersSharedWithAttachments(attachmentId),
        })

        // Snapshot the previous shared users
        const previousSharedUsers = queryClient.getQueryData<
          BaseApiResponse<SharedAttachmentUserItem[]>
        >(attachmentKeysFactory.usersSharedWithAttachments(attachmentId))

        // Snapshot my files to update share count
        const previousMyFiles = queryClient.getQueryData<
          BaseApiResponse<AttachmentItem[]>
        >(attachmentKeysFactory.myAttachments())

        // Optimistically remove the revoked users from the shared users list
        if (previousSharedUsers?.data) {
          const remainingSharedUsers = previousSharedUsers.data.filter(
            (user) => !userIds.includes(user.id!)
          )

          queryClient.setQueryData<BaseApiResponse<SharedAttachmentUserItem[]>>(
            attachmentKeysFactory.usersSharedWithAttachments(attachmentId),
            {
              ...previousSharedUsers,
              data: remainingSharedUsers,
            }
          )
        }

        // Optimistically update share count in myFiles
        if (previousMyFiles?.data) {
          const updatedMyFiles = previousMyFiles.data.map((file) => {
            if (file.id === attachmentId) {
              return {
                ...file,
                sharedCount: Math.max(
                  (file.sharedCount || 0) - userIds.length,
                  0
                ),
              }
            }
            return file
          })

          queryClient.setQueryData<BaseApiResponse<AttachmentItem[]>>(
            attachmentKeysFactory.myAttachments(),
            {
              ...previousMyFiles,
              data: updatedMyFiles,
            }
          )
        }

        return {
          previousSharedUsers,
          previousMyFiles,
        }
      },
      onError: (_error, variables, context) => {
        const typedContext = context as OptimisticRevokeContext | undefined
        const { attachmentId } = variables.body
        if (!typedContext) return

        // Rollback to the previous state if mutation fails
        if (typedContext.previousSharedUsers) {
          queryClient.setQueryData(
            attachmentKeysFactory.usersSharedWithAttachments(attachmentId),
            typedContext.previousSharedUsers
          )
        }

        // Rollback myFiles share count
        if (typedContext.previousMyFiles) {
          queryClient.setQueryData(
            attachmentKeysFactory.myAttachments(),
            typedContext.previousMyFiles
          )
        }
      },
      onSettled: (_data, _error, variables, _context) => {
        const { attachmentId } = variables.body

        // Always refetch to ensure we have the latest server state
        queryClient.invalidateQueries({
          queryKey:
            attachmentKeysFactory.usersSharedWithAttachments(attachmentId),
        })

        // Invalidate myFiles to update the actual share count
        queryClient.invalidateQueries({
          queryKey: attachmentKeysFactory.myAttachments(),
        })

        // Invalidate shared with me in case access was revoked
        queryClient.invalidateQueries({
          queryKey: attachmentKeysFactory.sharedWithMe(),
        })
      },
    }
  )
}
