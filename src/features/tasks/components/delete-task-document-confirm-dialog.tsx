import { toast } from 'sonner'
import { AppDialogInstance } from '@/hooks/use-dialog-instance'
import { AppConfirmDialog } from '@/components/app-confirm-dialog'
import { ConfirmDialogContent } from '@/components/confirm-dialog-content'
import { useDeleteBulkTaskDocuments } from '../hooks/use-delete-bulk-task-documents'

interface DeleteTaskDocumentsConfirmDialogProps {
  taskId: number
  documentIds: number[]
  onSuccess?: () => void
  dialog: AppDialogInstance
}

export default function DeleteTaskDocumentsConfirmDialog({
  taskId,
  documentIds,
  onSuccess,
  dialog,
}: DeleteTaskDocumentsConfirmDialogProps) {
  const deleteBulkTaskDocumentsMutation = useDeleteBulkTaskDocuments()

  const documentCount = documentIds.length

  return (
    <AppConfirmDialog dialog={dialog}>
      <ConfirmDialogContent
        key='task-documents-delete'
        destructive
        isLoading={deleteBulkTaskDocumentsMutation.isPending}
        handleConfirm={async () => {
          const deleteDocumentsPromise =
            deleteBulkTaskDocumentsMutation.mutateAsync({
              params: {
                query: {
                  taskId: taskId,
                },
              },
              body: documentIds,
            })

          toast.promise(deleteDocumentsPromise, {
            loading: 'Deleting task documents...',
            success: () => {
              onSuccess?.()
              return `Successfully deleted ${documentCount} document${documentCount === 1 ? '' : 's'}.`
            },
            error: 'Error deleting task documents',
          })
        }}
        className='max-w-md'
        title={`Delete ${documentCount} Document${documentCount === 1 ? '' : 's'}`}
        desc={
          <div className='space-y-2'>
            <p className='text-muted-foreground text-sm'>
              This will permanently remove {documentCount} document
              {documentCount === 1 ? '' : 's'} from Task #{taskId}.
            </p>
            <p className='text-muted-foreground text-sm font-medium'>
              This action cannot be undone.
            </p>
          </div>
        }
      />
    </AppConfirmDialog>
  )
}
