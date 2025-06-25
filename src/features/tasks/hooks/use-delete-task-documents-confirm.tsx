import { toast } from 'sonner'
import { useDialogs } from '@/hooks/use-dialogs'
import { useDeleteBulkTaskDocuments } from './use-delete-bulk-task-documents'

interface UseDeleteTaskDocumentsConfirmProps {
  taskId: number
  onSuccess?: () => void
}

export const useDeleteTaskDocumentsConfirm = ({
  taskId,
  onSuccess,
}: UseDeleteTaskDocumentsConfirmProps) => {
  const dialogs = useDialogs()
  const deleteBulkTaskDocumentsMutation = useDeleteBulkTaskDocuments()

  const onDeleteTaskDocuments = async (documentIds: number[]) => {
    if (documentIds.length === 0) return

    const documentCount = documentIds.length

    const confirmed = await dialogs.confirm(
      <div className='space-y-2'>
        <p className='text-muted-foreground text-sm'>
          Điều này sẽ xóa vĩnh viễn {documentCount} tài liệu
          {documentCount === 1 ? '' : ''} khỏi Nhiệm vụ #{taskId}.
        </p>
        <p className='text-muted-foreground text-sm font-medium'>
          Hành động này không thể hoàn tác.
        </p>
      </div>,
      {
        title: `Xóa ${documentCount} Tài liệu${documentCount === 1 ? '' : ''}`,
        severity: 'error',
        okText: 'Xóa',
        cancelText: 'Hủy',
      }
    )

    if (confirmed) {
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
        loading: 'Đang xóa tài liệu nhiệm vụ...',
        success: () => {
          onSuccess?.()
          return `Đã xóa thành công ${documentCount} tài liệu.`
        },
        error: 'Lỗi khi xóa tài liệu nhiệm vụ',
      })
    }
  }

  return {
    onDeleteTaskDocuments,
    isDeleting: deleteBulkTaskDocumentsMutation.isPending,
  }
}
