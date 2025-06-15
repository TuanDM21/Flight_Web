import { toast } from 'sonner'
import { DialogProps } from '@/hooks/use-dialogs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useUnlinkAttachmentsFromDocument } from '../hooks/use-unlink-attachments-from-document'
import { DocumentAttachment } from '../types'

export interface RemoveDocumentAttachmentPayload {
  documentId: number
  attachment: DocumentAttachment
  onSuccess?: () => void
}

export function RemoveDocumentAttachmentConfirmDialog({
  open,
  payload,
  onClose,
}: DialogProps<RemoveDocumentAttachmentPayload, boolean>) {
  const removeDocumentAttachmentsMutation = useUnlinkAttachmentsFromDocument()
  const fileName = payload.attachment.fileName || 'Unknown file'
  const attachmentId = payload.attachment.id || -1

  const handleConfirm = async () => {
    const removePromise = removeDocumentAttachmentsMutation.mutateAsync({
      params: { path: { documentId: Number(payload.documentId) } },
      body: { attachmentIds: [attachmentId] },
    })

    toast.promise(removePromise, {
      loading: `Removing attachment "${fileName}"...`,
      success: () => {
        payload.onSuccess?.()
        return `Tệp đính kèm "${fileName}" đã được xóa thành công!`
      },
      error: () => `Không thể xóa tệp đính kèm "${fileName}"`,
    })

    try {
      await removePromise
      await onClose(true)
    } catch {
      // Error is already handled by toast.promise
    }
  }

  const handleCancel = async () => {
    await onClose(false)
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => !isOpen && handleCancel()}
    >
      <AlertDialogContent className='max-w-md'>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Attachment</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className='space-y-2'>
              <p className='text-muted-foreground text-sm'>
                You are about to remove the file{' '}
                <span className='text-foreground font-medium'>{fileName}</span>{' '}
                from this document.
              </p>
              <p className='text-muted-foreground text-sm font-medium'>
                The file will still exist in the system but won't be attached to
                this document.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={handleCancel}
            disabled={removeDocumentAttachmentsMutation.isPending}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={removeDocumentAttachmentsMutation.isPending}
            className='bg-destructive hover:bg-destructive/90'
          >
            {removeDocumentAttachmentsMutation.isPending
              ? 'Removing...'
              : 'Remove'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
