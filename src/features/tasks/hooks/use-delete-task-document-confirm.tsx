import { toast } from 'sonner'
import { useDialogs } from '@/hooks/use-dialogs'
import { DocumentItem } from '@/features/documents/types'
import { useDeleteTaskDocumentMutation } from './use-delete-task-document'

interface UseDeleteTaskDocumentConfirmProps {
  taskId: number
  onSuccess?: () => void
}

export const useDeleteTaskDocumentConfirm = ({
  taskId,
  onSuccess,
}: UseDeleteTaskDocumentConfirmProps) => {
  const dialogs = useDialogs()
  const deleteTaskDocumentMutation = useDeleteTaskDocumentMutation(taskId)

  const onRemoveTaskDocument = async (document: DocumentItem) => {
    const confirmed = await dialogs.confirm(
      <div className='space-y-2'>
        <p className='text-muted-foreground text-sm'>
          Điều này sẽ gỡ tài liệu #{document.id} khỏi Nhiệm vụ #{taskId}.
        </p>
        <p className='text-muted-foreground text-sm'>
          Tài liệu sẽ vẫn tồn tại trong hệ thống nhưng không còn liên kết với
          nhiệm vụ này.
        </p>
        <p className='text-muted-foreground text-sm font-medium'>
          Hành động này không thể hoàn tác.
        </p>
      </div>,
      {
        title: 'Gỡ Tài liệu khỏi Nhiệm vụ',
        severity: 'error',
        okText: 'Gỡ',
        cancelText: 'Hủy',
      }
    )

    if (confirmed) {
      const removeDocumentPromise = deleteTaskDocumentMutation.mutateAsync({
        params: {
          query: {
            taskId: taskId,
            documentId: document.id!,
          },
        },
      })

      toast.promise(removeDocumentPromise, {
        loading: `Đang gỡ tài liệu #${document.id} khỏi nhiệm vụ...`,
        success: () => {
          onSuccess?.()
          return `Đã gỡ tài liệu #${document.id} khỏi nhiệm vụ thành công.`
        },
        error: 'Lỗi khi gỡ tài liệu khỏi nhiệm vụ',
      })
    }
  }

  return {
    onRemoveTaskDocument,
    isRemoving: deleteTaskDocumentMutation.isPending,
  }
}
