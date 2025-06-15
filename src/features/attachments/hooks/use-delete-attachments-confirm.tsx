import { toast } from 'sonner'
import { useDialogs } from '@/hooks/use-dialogs'
import { AttachmentItem } from '../types'
import { useDeleteAttachments } from './use-delete-attachments'

export function useDeleteAttachmentsConfirm() {
  const dialogs = useDialogs()
  const deleteAttachmentsMutation = useDeleteAttachments()

  const onDeleteAttachments = async (attachments: AttachmentItem[]) => {
    const attachmentCount = attachments.length
    const isMultiple = attachmentCount > 1

    const confirmed = await dialogs.confirm(
      <div>
        <p>
          Are you sure you want to delete{' '}
          {isMultiple
            ? `these ${attachmentCount} attachments`
            : 'this attachment'}
          ?
        </p>
        <p className='text-muted-foreground mt-2 text-sm'>
          This action cannot be undone.
        </p>
      </div>,
      {
        title: isMultiple ? 'Delete Attachments' : 'Delete Attachment',
        okText: 'Delete',
        cancelText: 'Cancel',
        severity: 'error',
      }
    )

    if (confirmed) {
      const attachmentIds = attachments
        .map((attachment) => attachment.id)
        .filter((id): id is number => Boolean(id))

      const deleteAttachmentsPromise = deleteAttachmentsMutation.mutateAsync({
        body: {
          attachmentIds,
        },
      })

      toast.promise(deleteAttachmentsPromise, {
        loading: `Deleting ${attachmentCount > 1 ? `${attachmentCount} attachments` : 'attachment'}...`,
        success: () => {
          return `${attachmentCount > 1 ? `${attachmentCount} attachments` : 'Attachment'} deleted successfully!`
        },
        error: `Failed to delete ${attachmentCount > 1 ? 'attachments' : 'attachment'}. Please try again.`,
      })
    }
  }

  return {
    onDeleteAttachments,
    isAttachmentsDeleting: deleteAttachmentsMutation.isPending,
  }
}
