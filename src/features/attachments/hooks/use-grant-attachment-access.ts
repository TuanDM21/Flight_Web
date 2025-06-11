import { useQueryClient } from '@tanstack/react-query'
import $queryClient from '@/api'
import { BaseApiResponse } from '@/types/response'
import { attachmentKeysFactory } from '@/api/query-key-factory'

interface FileShareUser {
  id: number
  attachmentId: number
  fileName: string
  filePath: string
  fileSize: number
  sharedBy?: {
    id: number
    name: string
    email: string
  }
  sharedWith?: {
    id: number
    name: string
    email: string
  }
  sharedAt: string
  note?: string
  active: boolean
  permission?: string
  expired?: boolean
  expiresAt?: string
}

interface OptimisticGrantContext {
  attachmentId: number
  userIds: number[]
  previousSharedUsers?: BaseApiResponse<FileShareUser[]>
}

export const useGrantAttachmentAccess = () => {
  const queryClient = useQueryClient()

  return $queryClient.useMutation('post', '/api/attachments/share', {
    onMutate: async (variables): Promise<OptimisticGrantContext> => {
      const { attachmentId, userIds } = variables.body

      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({
        queryKey:
          attachmentKeysFactory.usersSharedWithAttachments(attachmentId),
      })

      // Snapshot the previous shared users
      const previousSharedUsers = queryClient.getQueryData<
        BaseApiResponse<FileShareUser[]>
      >(attachmentKeysFactory.usersSharedWithAttachments(attachmentId))

      // Note: We can't optimistically add users without knowing their details
      // This is a limitation - we'd need user data to create placeholder entries
      // For now, we'll just invalidate the cache immediately after success

      return {
        attachmentId,
        userIds,
        previousSharedUsers,
      }
    },
    onError: (_error, _variables, context) => {
      const typedContext = context as OptimisticGrantContext | undefined
      if (!typedContext) return

      // Rollback to the previous state if mutation fails
      if (typedContext.previousSharedUsers) {
        queryClient.setQueryData(
          attachmentKeysFactory.usersSharedWithAttachments(
            typedContext.attachmentId
          ),
          typedContext.previousSharedUsers
        )
      }
    },
    onSettled: (_data, _error, variables, _context) => {
      const { attachmentId } = variables.body

      // Always refetch to ensure we have the latest server state with new shared users
      queryClient.invalidateQueries({
        queryKey:
          attachmentKeysFactory.usersSharedWithAttachments(attachmentId),
      })

      // Invalidate shared with me in case new users can now see shared files
      queryClient.invalidateQueries({
        queryKey: attachmentKeysFactory.sharedWithMe(),
      })
    },
  })
}
