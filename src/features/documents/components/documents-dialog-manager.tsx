import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDocuments } from '../context'
import { useDeleteDocuments } from '../hooks/use-delete-documents'

export function DocumentsDialogManager() {
  const { open, setOpen, currentDocumentId, setCurrentDocumentId } =
    useDocuments()
  const deleteDocumentMutation = useDeleteDocuments()

  return (
    <>
      {currentDocumentId && (
        <>
          <ConfirmDialog
            key='task-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setCurrentDocumentId(null)
            }}
            isLoading={deleteDocumentMutation.isPending}
            handleConfirm={async () => {
              const deleteDocumentPromise = deleteDocumentMutation.mutateAsync({
                params: {
                  path: { id: currentDocumentId },
                },
              })
              toast.promise(deleteDocumentPromise, {
                loading: `Deleting document #${currentDocumentId}...`,
                success: `Document #${currentDocumentId} deleted successfully!`,
                error: `Failed to delete document #${currentDocumentId}. Please try again.`,
              })
              setOpen(null)
              setCurrentDocumentId(null)
            }}
            className='max-w-md'
            title={`Delete Document #${currentDocumentId}`}
            desc={
              <div className='space-y-2'>
                <p className='text-muted-foreground text-sm'>
                  This will permanently delete document #{currentDocumentId} and
                  all its associated data including:
                  <ul className='list-disc pl-5'>
                    <li>Document content</li>
                    <li>Notes</li>
                    <li>Attachments</li>
                  </ul>
                </p>
                <p className='text-muted-foreground text-sm font-medium'>
                  This action cannot be undone.
                </p>
              </div>
            }
          />
        </>
      )}
    </>
  )
}
