import { toast } from 'sonner'
import { useDialogs } from '@/hooks/use-dialogs'
import { DocumentItem } from '../types'
import { useDeleteDocuments } from './use-delete-documents'

export function useDeleteDocumentConfirm() {
  const dialogs = useDialogs()
  const deleteDocumentMutation = useDeleteDocuments()

  const onDeleteDocument = async (document: DocumentItem) => {
    const confirmed = await dialogs.confirm(
      <div>
        <p>Are you sure you want to delete this document?</p>
        <p className='text-muted-foreground mt-2 text-sm'>
          Document ID: #{document.id}
        </p>
        <p className='text-muted-foreground text-sm'>
          This action cannot be undone.
        </p>
      </div>,
      {
        title: 'Delete Document',
        okText: 'Delete',
        cancelText: 'Cancel',
        severity: 'error',
      }
    )

    if (confirmed) {
      const documentId = document.id!

      const deleteDocumentPromise = deleteDocumentMutation.mutateAsync({
        params: {
          path: { id: documentId },
        },
      })

      toast.promise(deleteDocumentPromise, {
        loading: `Deleting document #${documentId}...`,
        success: () => {
          return `Tài liệu #${documentId} đã được xóa thành công!`
        },
        error: `Không thể xóa tài liệu #${documentId}. Vui lòng thử lại.`,
      })
    }
  }

  return {
    onDeleteDocument,
    isDocumentDeleting: deleteDocumentMutation.isPending,
  }
}
