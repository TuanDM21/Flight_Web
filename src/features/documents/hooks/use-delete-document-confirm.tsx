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
        <p>Bạn có chắc chắn muốn xóa tài liệu này?</p>
        <p className='text-muted-foreground mt-2 text-sm'>
          Mã tài liệu: #{document.id}
        </p>
        <p className='text-muted-foreground text-sm'>
          Hành động này không thể hoàn tác.
        </p>
      </div>,
      {
        title: 'Xóa Tài Liệu',
        okText: 'Xóa',
        cancelText: 'Hủy',
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
        loading: `Đang xóa tài liệu #${documentId}...`,
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
