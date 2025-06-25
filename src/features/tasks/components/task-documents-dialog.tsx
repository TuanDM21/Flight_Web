import { IconTrash } from '@tabler/icons-react'
import { TasksRoute } from '@/routes/_authenticated/tasks'
import { FileChartPie, FilePlus2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/context/auth-context'
import { useDataTable } from '@/hooks/use-data-table'
import { DialogProps } from '@/hooks/use-dialogs'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AppDialog } from '@/components/app-dialog'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { useDeleteTaskDocumentsConfirm } from '../hooks/use-delete-task-documents-confirm'
import { useInsertBulkTaskDocuments } from '../hooks/use-insert-bulk-task-document'
import { useTaskDocumentColumns } from '../hooks/use-task-document-columns'
import { useViewTaskDocuments } from '../hooks/use-task-documents'
import { Task, TaskDocument } from '../types'
import { SelectDocumentsDialog } from './select-documents-dialog'

interface TaskDocumentsDialogProps {
  task: Task
}

export function TaskDocumentsDialog({
  payload,
  open,
  onClose,
}: DialogProps<TaskDocumentsDialogProps>) {
  const { task } = payload
  const taskId = task.id!
  const { user } = useAuth()
  const isTaskOwner = user?.id === task.createdByUser?.id

  const searchParams = TasksRoute.useSearch()
  const currentType = searchParams.type || 'assigned'
  const insertBulkTaskDocumentsMutation =
    useInsertBulkTaskDocuments(currentType)

  const { data: taskDocuments, isLoading: isTaskDocumentsLoading } =
    useViewTaskDocuments(taskId)

  const selectDocumentDialogInstance = AppDialog.useDialog()

  const taskDocumentColumns = useTaskDocumentColumns({ taskId })

  const { table: documentsTable } = useDataTable({
    data: taskDocuments?.data || [],
    columns: taskDocumentColumns,
    pageCount: 1,
  })

  const { onDeleteTaskDocuments } = useDeleteTaskDocumentsConfirm({
    taskId,
    onSuccess: () => {
      documentsTable.resetRowSelection()
    },
  })

  const selectedDocumentRows = documentsTable.getFilteredSelectedRowModel().rows
  const noDocuments = !taskDocuments?.data || taskDocuments.data.length === 0

  const handleDeleteTaskDocuments = async () => {
    const deleteDocumentIds = selectedDocumentRows.map(
      (row) => row.original.id
    ) as number[]

    await onDeleteTaskDocuments(deleteDocumentIds)
  }

  const getSelectedDocumentIds = () => {
    return (
      (taskDocuments?.data?.map((doc) => doc.id).filter(Boolean) as number[]) ||
      []
    )
  }

  const handleSelectedDocuments = (documents: TaskDocument[]) => {
    const selectedDocumentIds = documents
      .map((doc) => doc.id)
      .filter(Boolean) as number[]

    const promise = insertBulkTaskDocumentsMutation.mutateAsync({
      params: {
        query: {
          taskId,
        },
      },
      body: selectedDocumentIds,
    })

    toast.promise(promise, {
      loading: 'Đang thêm tài liệu...',
      success: () => {
        documentsTable.resetRowSelection()
        selectDocumentDialogInstance.close()
        return `Đã thêm ${selectedDocumentIds.length} tài liệu thành công`
      },
      error: (error) => {
        console.error('Error adding documents:', error)
        return 'Không thể thêm tài liệu'
      },
    })
  }

  return (
    <>
      {selectDocumentDialogInstance.isOpen && (
        <SelectDocumentsDialog
          getSelectedDocumentIds={getSelectedDocumentIds}
          onSubmit={handleSelectedDocuments}
          dialog={selectDocumentDialogInstance}
        />
      )}

      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className='max-h-7xl flex flex-col sm:max-w-7xl'>
          <DialogHeader>
            <DialogTitle className='text-lg font-bold'>
              Tất cả tài liệu cho Task #{taskId}
            </DialogTitle>
          </DialogHeader>

          <div className='flex-1 overflow-hidden'>
            {isTaskDocumentsLoading ? (
              <DataTableSkeleton columnCount={5} rowCount={5} withViewOptions />
            ) : noDocuments ? (
              <div className='flex h-full flex-col items-center justify-center space-y-4 py-8'>
                <div className='bg-muted rounded-full p-4'>
                  <FileChartPie className='text-muted-foreground h-8 w-8' />
                </div>
                <div className='space-y-2 text-center'>
                  <h3 className='text-muted-foreground text-lg font-medium'>
                    Chưa có tài liệu nào được thêm cho nhiệm vụ này
                  </h3>
                  {isTaskOwner && (
                    <>
                      <Button
                        className='space-x-1'
                        onClick={selectDocumentDialogInstance.open}
                      >
                        <span>Thêm Tài Liệu</span> <FilePlus2Icon />
                      </Button>
                      <p className='text-muted-foreground max-w-sm text-sm'>
                        Hãy là người đầu tiên thêm tài liệu cho nhiệm vụ này.
                      </p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <>
                {isTaskOwner && (
                  <div className='mb-4 flex justify-end gap-2'>
                    {selectedDocumentRows.length > 0 && (
                      <Button
                        variant='destructive'
                        className='space-x-2'
                        onClick={handleDeleteTaskDocuments}
                      >
                        <IconTrash className='h-4 w-4' />
                        <span>Xóa ({selectedDocumentRows.length})</span>
                      </Button>
                    )}
                    <Button
                      className='space-x-2'
                      onClick={selectDocumentDialogInstance.open}
                    >
                      <FilePlus2Icon className='h-4 w-4' />
                      <span>Thêm tài liệu</span>
                    </Button>
                  </div>
                )}
                <DataTable table={documentsTable} />
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
