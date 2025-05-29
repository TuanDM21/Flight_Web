import { useMemo } from 'react'
import { FileText } from 'lucide-react'
import { useDataTable } from '@/hooks/use-data-table'
import { AppDialogInstance } from '@/hooks/use-dialog-instance'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AppDialog } from '@/components/app-dialog'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { documentColumns } from '@/features/documents/config'
import { useViewDocuments } from '@/features/documents/hooks/use-view-documents'
import { TaskDocument } from '@/features/tasks/types'

interface SelectDocumentDialogProps {
  getSelectedDocumentIds: () => number[]
  onSubmit: (documents: TaskDocument[]) => void
  dialog: AppDialogInstance
}

export function SelectDocumentsDialog({
  getSelectedDocumentIds,
  onSubmit,
  dialog,
}: SelectDocumentDialogProps) {
  const { data: allDocuments, isLoading } = useViewDocuments()

  const availableDocuments = useMemo(() => {
    if (!allDocuments?.data) return []
    const selectedDocumentIds = getSelectedDocumentIds()
    return allDocuments.data.filter(
      (doc) => !selectedDocumentIds.includes(doc.id!)
    )
  }, [allDocuments, getSelectedDocumentIds])

  const { table } = useDataTable({
    data: availableDocuments,
    columns: documentColumns,
    pageCount: 1,
    getRowId: (row) => String(row.id ?? 'unknown'),
  })

  const noDocuments = !allDocuments?.data || allDocuments.data.length === 0

  const EmptyState = () => (
    <div className='flex h-[400px] items-center justify-center'>
      <div className='flex flex-col items-center gap-4 text-center'>
        <div className='bg-muted rounded-full p-4'>
          <FileText className='text-muted-foreground h-12 w-12' />
        </div>
        <div className='space-y-2'>
          <h3 className='text-lg font-semibold'>No documents available</h3>
          <p className='text-muted-foreground max-w-sm text-sm'>
            There are no documents in the system yet. Create some documents
            first before assigning them to tasks.
          </p>
        </div>
      </div>
    </div>
  )

  const handleSaveSelection = () => {
    const selectedDocuments = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original)

    onSubmit(selectedDocuments as Required<TaskDocument[]>)
    table.resetRowSelection()
  }

  return (
    <AppDialog dialog={dialog}>
      <DialogContent className='flex h-[80vh] max-h-[800px] flex-col sm:max-w-7xl'>
        <DialogHeader className='text-left'>
          <DialogTitle>Select Documents</DialogTitle>
          <DialogDescription>
            Select one or more documents from the list below
          </DialogDescription>
        </DialogHeader>
        <div className='flex-1 overflow-auto'>
          {isLoading ? (
            <DataTableSkeleton columnCount={10} rowCount={10} withViewOptions />
          ) : noDocuments ? (
            <EmptyState />
          ) : (
            <DataTable table={table} />
          )}
        </div>
        <DialogFooter className='gap-2'>
          <Button variant='outline' onClick={dialog.close}>
            Close
          </Button>
          <Button
            onClick={handleSaveSelection}
            disabled={
              isLoading ||
              noDocuments ||
              table.getFilteredSelectedRowModel().rows.length === 0
            }
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </AppDialog>
  )
}
