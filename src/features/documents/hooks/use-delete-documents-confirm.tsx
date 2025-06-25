import { toast } from 'sonner'
import { useDialogs } from '@/hooks/use-dialogs'
import { DocumentItem } from '../types'
import { useDeleteDocuments } from './use-delete-documents'

export function useDeleteDocumentsConfirm() {
  const dialogs = useDialogs()
  const deleteDocumentsMutation = useDeleteDocuments()

  const onDeleteDocuments = async (documents: DocumentItem[]) => {
    const documentCount = documents.length

    const confirmed = await dialogs.confirm(
      <div>
        <p>Bạn có chắc chắn muốn xóa {documentCount} tài liệu đã chọn?</p>
        <div className='text-muted-foreground mt-2 text-sm'>
          <p>Các tài liệu sẽ bị xóa:</p>
          <ul className='mt-1 list-inside list-disc'>
            {documents.slice(0, 5).map((doc) => (
              <li key={doc.id}>#{doc.id}</li>
            ))}
            {documents.length > 5 && (
              <li>... và {documents.length - 5} tài liệu khác</li>
            )}
          </ul>
        </div>
        <p className='text-muted-foreground mt-2 text-sm'>
          Hành động này không thể hoàn tác.
        </p>
      </div>,
      {
        title: 'Xóa Nhiều Tài Liệu',
        okText: 'Xóa Tất Cả',
        cancelText: 'Hủy',
        severity: 'error',
      }
    )

    if (confirmed) {
      const documentIds = documents.map((doc) => doc.id) as number[]
      const deleteMultiplePromise = deleteDocumentsMutation.mutateAsync({
        body: { documentIds },
      })

      toast.promise(deleteMultiplePromise, {
        loading: `Đang xóa ${documentCount} tài liệu...`,
        success: () => {
          return `Đã xóa thành công ${documentCount} tài liệu!`
        },
        error: `Không thể xóa một số tài liệu. Vui lòng thử lại.`,
      })
    }
  }

  return {
    onDeleteDocuments,
    isDocumentDeleting: deleteDocumentsMutation.isPending,
  }
}
