import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { BaseApiResponse } from '@/types/response'
import { attachmentKeysFactory } from '@/api/query-key-factory'
import { UserItem } from '@/features/users/types'

interface OptimisticRevokeContext {
  previousSharedUsers?: BaseApiResponse<UserItem[]>
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
          BaseApiResponse<UserItem[]>
        >(attachmentKeysFactory.usersSharedWithAttachments(attachmentId))

        // Optimistically remove the revoked users from the shared users list
        if (previousSharedUsers?.data) {
          const remainingSharedUsers = previousSharedUsers.data.filter(
            (user) => !userIds.includes(user.id)
          )

          queryClient.setQueryData<BaseApiResponse<UserItem[]>>(
            attachmentKeysFactory.usersSharedWithAttachments(attachmentId),
            {
              ...previousSharedUsers,
              data: remainingSharedUsers,
            }
          )
        }

        return {
          previousSharedUsers,
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
      },
      onSettled: (_data, _error, variables, _context) => {
        const { attachmentId } = variables.body

        // Always refetch to ensure we have the latest server state
        queryClient.invalidateQueries({
          queryKey:
            attachmentKeysFactory.usersSharedWithAttachments(attachmentId),
        })
      },
    }
  )
}
