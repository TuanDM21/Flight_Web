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
    const userText = `${userCount} người dùng`
    const fileText = fileName ? `"${fileName}"` : 'tệp đính kèm này'

    const confirmed = await dialogs.confirm(
      <div className='space-y-3'>
        <p className='text-sm'>
          Bạn có chắc chắn muốn thu hồi quyền truy cập {fileText} từ {userText}?
        </p>
        <p className='text-muted-foreground text-sm'>
          {isMultiple ? 'Những người dùng này' : 'Người dùng này'} sẽ không thể
          xem hoặc tải xuống tệp nữa.
        </p>
      </div>,
      {
        title: `Thu hồi quyền truy cập (${userCount})`,
        okText: 'Thu hồi quyền truy cập',
        cancelText: 'Hủy',
        severity: 'error',
      }
    )

    if (!confirmed) {
      return false
    }

    const loadingMessage = `Đang thu hồi quyền truy cập${fileName ? ` cho "${fileName}"` : ''}...`
    const successMessage = `Đã thu hồi quyền truy cập cho ${userCount} người dùng`
    const errorMessage = `Không thể thu hồi quyền truy cập cho ${userCount} người dùng`

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
