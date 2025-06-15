import { toast } from 'sonner'
import { useDialogs } from '@/hooks/use-dialogs'
import { SharedAttachmentUserItem } from '../types'
import { useRevokeAttachmentAccess } from './use-revoke-attachment-access'

interface RevokeAccessParams {
  attachmentId: number
  users: SharedAttachmentUserItem[]
  fileName?: string
}

export function useRevokeAttachmentAccessConfirm() {
  const dialogs = useDialogs()
  const revokeUserAccess = useRevokeAttachmentAccess()

  const onRevokeAccessConfirm = async (params: RevokeAccessParams) => {
    const { attachmentId, users, fileName } = params
    const userIds = users.map((user) => user.id) as number[]
    const userCount = userIds.length

    if (userCount === 0) return false

    const isMultiple = userCount > 1
    const userText = `${userCount} user${isMultiple ? 's' : ''}`
    const fileText = fileName ? `"${fileName}"` : 'this attachment'

    const confirmed = await dialogs.confirm(
      <div className='space-y-3'>
        <p className='text-sm'>
          Are you sure you want to revoke access to {fileText} from {userText}?
        </p>
        <p className='text-muted-foreground text-sm'>
          {isMultiple ? 'These users' : 'This user'} will no longer be able to
          view or download the file.
        </p>
      </div>,
      {
        title: `Revoke Access (${userCount})`,
        okText: 'Revoke Access',
        cancelText: 'Cancel',
        severity: 'error',
      }
    )

    if (!confirmed) {
      return false
    }

    const loadingMessage = `Revoking access${fileName ? ` to "${fileName}"` : ''}...`
    const successMessage = `Access revoked for ${userCount} user${isMultiple ? 's' : ''}`
    const errorMessage = `Failed to revoke access for ${userCount} user${isMultiple ? 's' : ''}`

    const revokePromise = revokeUserAccess.mutateAsync({
      body: {
        attachmentId,
        userIds,
      },
    })

    toast.promise(revokePromise, {
      loading: loadingMessage,
      success: successMessage,
      error: errorMessage,
    })

    return true
  }

  return {
    onRevokeAccessConfirm,
    revokeUserAccess,
  }
}
