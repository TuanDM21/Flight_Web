import { toast } from 'sonner'
import { useDialogs } from '@/hooks/use-dialogs'
import { DocumentAttachment } from '../types'
import { useUnlinkAttachmentsFromDocument } from './use-unlink-attachments-from-document'

export function useUnlinkAttachmentsFromDocumentConfirm() {
  const dialogs = useDialogs()
  const unlinkAttachmentsFromDocumentMutation =
    useUnlinkAttachmentsFromDocument()

  const onUnlinkAttachmentFromDocument = async (
    documentId: number,
    attachment: DocumentAttachment
  ) => {
    const fileName = attachment.fileName!
    const attachmentId = attachment.id!

    const confirmed = await dialogs.confirm(
      <div className='space-y-2'>
        <p className='text-muted-foreground text-sm'>
          You are about to unlink the file{' '}
          <span className='text-foreground font-medium'>{fileName}</span> from
          this document.
        </p>
        <p className='text-muted-foreground text-sm font-medium'>
          The file will still exist in the system but won't be linked to this
          document.
        </p>
      </div>,
      {
        title: 'Unlink Attachment',
        okText: 'Unlink',
        cancelText: 'Cancel',
        severity: 'error',
        onClose: async (confirmed: boolean) => {
          if (confirmed) {
            const unlinkPromise =
              unlinkAttachmentsFromDocumentMutation.mutateAsync({
                params: { path: { documentId: Number(documentId) } },
                body: { attachmentIds: [attachmentId] },
              })

            toast.promise(unlinkPromise, {
              loading: `Unlinking attachment "${fileName}"...`,
              success: () => {
                return `Tệp đính kèm "${fileName}" đã được hủy liên kết thành công!`
              },
              error: () => `Không thể hủy liên kết tệp đính kèm "${fileName}"`,
            })

            await unlinkPromise
          }
        },
      }
    )

    return confirmed
  }

  return {
    onUnlinkAttachmentFromDocument,
    isAttachmentUnlinking: unlinkAttachmentsFromDocumentMutation.isPending,
  }
}
