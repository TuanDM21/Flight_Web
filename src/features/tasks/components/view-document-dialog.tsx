import { useState } from 'react'
import { IconTrash } from '@tabler/icons-react'
import { FileChartPie, FilePlus2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { useDataTable } from '@/hooks/use-data-table'
import { AppDialogInstance } from '@/hooks/use-dialog-instance'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AppConfirmDialog } from '@/components/app-confirm-dialog'
import { AppDialog } from '@/components/app-dialog'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { documentColumns } from '@/features/documents/config'
import { useInsertBulkTaskDocuments } from '../hooks/use-insert-bulk-task-document'
import { useViewTaskDocuments } from '../hooks/use-view-task-documents'
import { TaskDocument } from '../types'
import DeleteTaskDocumentsConfirmDialog from './delete-task-document-confirm-dialog'
import { SelectDocumentsDialog } from './select-documents-dialog'

interface Props {
  taskId: number
  dialog: AppDialogInstance
}

export function ViewDocumentDialog({ taskId, dialog }: Props) {
  const { data: taskDocuments, isLoading: isTaskDocumentsLoading } =
    useViewTaskDocuments(taskId)

  const deleteDocumentsDialogInstance = AppConfirmDialog.useDialog()
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<number[]>([])
  const insertBulkTaskDocumentsMutation = useInsertBulkTaskDocuments()

  const selectDocumentDialogInstance = AppDialog.useDialog()

  const { table: documentsTable } = useDataTable({
    data: taskDocuments?.data || [],
    columns: documentColumns,
    pageCount: 1,
  })

  const selectedDocumentRows = documentsTable.getFilteredSelectedRowModel().rows

  const handleDeleteTaskDocuments = () => {
    const deleteDocumentIds = selectedDocumentRows.map(
      (row) => row.original.id
    ) as number[]

    setSelectedDocumentIds(deleteDocumentIds)
    deleteDocumentsDialogInstance.open()
  }

  const handleAddDocument = () => {
    selectDocumentDialogInstance.open()
  }

  const noDocuments = !taskDocuments?.data || taskDocuments.data.length === 0

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
      loading: 'Adding documents...',
      success: () => {
        documentsTable.resetRowSelection()
        setSelectedDocumentIds([])
        selectDocumentDialogInstance.close()
        return `Added ${selectedDocumentIds.length} documents successfully`
      },
      error: (error) => {
        console.error('Error adding documents:', error)
        return 'Failed to add documents'
      },
    })
  }

  return (
    <>
      {selectedDocumentIds.length > 0 &&
        deleteDocumentsDialogInstance.isOpen && (
          <DeleteTaskDocumentsConfirmDialog
            taskId={taskId}
            documentIds={selectedDocumentIds}
            onSuccess={() => {
              documentsTable.resetRowSelection()
              setSelectedDocumentIds([])
              deleteDocumentsDialogInstance.close()
            }}
            dialog={deleteDocumentsDialogInstance}
          />
        )}

      {selectDocumentDialogInstance.isOpen && (
        <SelectDocumentsDialog
          getSelectedDocumentIds={getSelectedDocumentIds}
          onSubmit={handleSelectedDocuments}
          dialog={selectDocumentDialogInstance}
        />
      )}

      <AppDialog dialog={dialog}>
        <DialogContent
          className='max-h-7xl flex flex-col sm:max-w-7xl'
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className='text-lg font-bold'>
              All Documents for Task #{taskId}
            </DialogTitle>
            <p className='text-muted-foreground mt-1 text-sm'>
              View all documents for this task
            </p>
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
                    No documents yet
                  </h3>
                  <Button className='space-x-1' onClick={handleAddDocument}>
                    <span>Add Document</span> <FilePlus2Icon />
                  </Button>
                  <p className='text-muted-foreground max-w-sm text-sm'>
                    Be the first to add a document for this task.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className='mb-4 flex justify-end gap-2'>
                  {selectedDocumentRows.length > 0 && (
                    <Button
                      variant='destructive'
                      className='space-x-2'
                      onClick={handleDeleteTaskDocuments}
                    >
                      <IconTrash className='h-4 w-4' />
                      <span>Remove ({selectedDocumentRows.length})</span>
                    </Button>
                  )}
                  <Button className='space-x-2' onClick={handleAddDocument}>
                    <FilePlus2Icon className='h-4 w-4' />
                    <span>Add Document</span>
                  </Button>
                </div>
                <DataTable table={documentsTable} />
              </>
            )}
          </div>
        </DialogContent>
      </AppDialog>
    </>
  )
}
