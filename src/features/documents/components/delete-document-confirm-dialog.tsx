import { toast } from 'sonner'
import { AppDialogInstance } from '@/hooks/use-dialog-instance'
import { AppConfirmDialog } from '@/components/app-confirm-dialog'
import { ConfirmDialogContent } from '@/components/confirm-dialog-content'
import { useDeleteDocuments } from '../hooks/use-delete-documents'

interface DeleteDocumentConfirmDialogProps {
  documentId: number
  dialog: AppDialogInstance
}
export default function DeleteDocumentConfirmDialog({
  documentId: currentDocumentId,
  dialog,
}: DeleteDocumentConfirmDialogProps) {
  const deleteDocumentMutation = useDeleteDocuments()

  return (
    <AppConfirmDialog dialog={dialog}>
      <ConfirmDialogContent
        key='document-delete'
        destructive
        isLoading={deleteDocumentMutation.isPending}
        handleConfirm={() => {
          const deleteDocumentPromise = deleteDocumentMutation.mutateAsync({
            params: {
              path: { id: currentDocumentId },
            },
          })
          toast.promise(deleteDocumentPromise, {
            loading: `Deleting document #${currentDocumentId}...`,
            success: () => {
              dialog.close()
              return `Document #${currentDocumentId} deleted successfully!`
            },
            error: `Failed to delete document #${currentDocumentId}. Please try again.`,
          })
        }}
        className='max-w-md'
        title={`Delete Document #${currentDocumentId}`}
        desc={
          <div className='space-y-2'>
            <div className='text-muted-foreground text-sm'>
              <p>
                This will permanently delete document #{currentDocumentId} and
                all its associated data including:
              </p>
              <ul className='mt-2 list-disc pl-5'>
                <li>Document content</li>
                <li>Notes</li>
                <li>Attachments</li>
              </ul>
            </div>
            <p className='text-muted-foreground text-sm font-medium'>
              This action cannot be undone.
            </p>
          </div>
        }
      />
    </AppConfirmDialog>
  )
}
