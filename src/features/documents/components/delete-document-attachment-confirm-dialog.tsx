import { toast } from 'sonner'
import { AppDialogInstance } from '@/hooks/use-dialog-instance'
import { AppConfirmDialog } from '@/components/app-confirm-dialog'
import { ConfirmDialogContent } from '@/components/confirm-dialog-content'
import { useRemoveDocumentAttachments } from '../hooks/use-remove-document-attachments'
import { DocumentAttachment } from '../types'

interface DeleteDocumentAttachmentConfirmDialogProps {
  dialog: AppDialogInstance
  documentId: number
  attachment: DocumentAttachment
  onSuccess?: () => void
}

export function DeleteDocumentAttachmentConfirmDialog({
  dialog,
  documentId,
  attachment,
  onSuccess,
}: DeleteDocumentAttachmentConfirmDialogProps) {
  const deleteDocumentAttachmentsMutation = useRemoveDocumentAttachments()
  const fileName = attachment.fileName || 'Unknown file'
  const attachmentId = attachment.id || -1

  return (
    <AppConfirmDialog dialog={dialog}>
      {dialog.isOpen && (
        <ConfirmDialogContent
          key='delete-document-attachment'
          destructive
          isLoading={deleteDocumentAttachmentsMutation.isPending}
          handleConfirm={async () => {
            const deletePromise = deleteDocumentAttachmentsMutation.mutateAsync(
              {
                params: { path: { documentId: Number(documentId) } },
                body: { attachmentIds: [attachmentId] },
              }
            )
            toast.promise(deletePromise, {
              loading: `Removing attachment "${fileName}"...`,
              success: () => {
                dialog.close()
                onSuccess?.()
                return `Attachment "${fileName}" removed successfully!`
              },
              error: () => `Failed to remove attachment "${fileName}"`,
            })
          }}
          className='max-w-md'
          title='Delete Attachment'
          desc={
            <div className='space-y-2'>
              <p className='text-muted-foreground text-sm'>
                You are about to delete the file{' '}
                <span className='text-foreground font-medium'>{fileName}</span>.
              </p>
              <p className='text-muted-foreground text-sm font-medium'>
                This action cannot be undone.
              </p>
            </div>
          }
        />
      )}
    </AppConfirmDialog>
  )
}
