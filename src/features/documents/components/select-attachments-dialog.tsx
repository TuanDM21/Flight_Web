import { Suspense, useMemo } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
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
import { useAttachmentTableColumns } from '@/features/attachments/hooks/use-attachment-table-columns'
import { myAccessibleAttachmentsQueryOptions } from '@/features/attachments/hooks/use-my-accessible-attachments'
import { DocumentAttachment } from '../types'

interface SelectAttachmentDialogProps {
  getSelectedAttachmentIds: () => number[]
  onSubmit: (attachments: Required<DocumentAttachment>[]) => void
  dialog: AppDialogInstance
}

// Content component that uses suspense query
function SelectAttachmentsContent({
  getSelectedAttachmentIds,
  onSubmit,
  dialog,
}: SelectAttachmentDialogProps) {
  const { data: allAttachments } = useSuspenseQuery(
    myAccessibleAttachmentsQueryOptions()
  )

  const attachmentsColumns = useAttachmentTableColumns({
    showColumns: {
      actions: false,
      shared: false,
    },
  })

  const availableAttachments = useMemo(() => {
    if (!allAttachments?.data) return []
    const selectedAttachmentIds = getSelectedAttachmentIds()
    return allAttachments.data.filter(
      (att: DocumentAttachment) => !selectedAttachmentIds.includes(att.id!)
    )
  }, [allAttachments, getSelectedAttachmentIds])

  const { table } = useDataTable({
    data: availableAttachments,
    columns: attachmentsColumns,
    pageCount: 1,
    getRowId: (row) => String(row.id ?? 'unknown'),
  })

  const noAttachments = availableAttachments.length === 0

  const EmptyState = () => (
    <div className='flex h-full items-center justify-center'>
      <div className='flex flex-col items-center gap-4 text-center'>
        <div className='bg-muted rounded-full p-4'>
          <FileText className='text-muted-foreground h-12 w-12' />
        </div>
        <div className='space-y-2'>
          <h3 className='text-lg font-semibold'>No attachments available</h3>
          <p className='text-muted-foreground max-w-sm text-sm'>
            There are no attachments in the system yet. Upload some attachments
            first before assigning them to tasks.
          </p>
        </div>
      </div>
    </div>
  )

  const handleSaveSelection = () => {
    const selectedAttachments = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original)

    onSubmit(selectedAttachments as Required<DocumentAttachment>[])
  }

  return (
    <>
      <DialogHeader className='text-left'>
        <DialogTitle>Select Attachments</DialogTitle>
        <DialogDescription>
          Select one or more attachments from the list below
        </DialogDescription>
      </DialogHeader>
      <div className='flex-1 overflow-auto'>
        {noAttachments ? (
          <EmptyState />
        ) : (
          <DataTable table={table} className='h-full' />
        )}
      </div>
      <DialogFooter className='gap-2'>
        <Button variant='outline' onClick={dialog.close}>
          Close
        </Button>
        <Button
          onClick={handleSaveSelection}
          disabled={
            noAttachments ||
            table.getFilteredSelectedRowModel().rows.length === 0
          }
        >
          Confirm
        </Button>
      </DialogFooter>
    </>
  )
}

export function SelectAttachmentsDialog({
  getSelectedAttachmentIds,
  onSubmit,
  dialog,
}: SelectAttachmentDialogProps) {
  return (
    <AppDialog dialog={dialog}>
      <DialogContent className='flex max-h-[800px] flex-col sm:max-w-7xl'>
        <Suspense
          fallback={
            <div className='flex h-full flex-col'>
              <DialogHeader className='text-left'>
                <DialogTitle>Select Attachments</DialogTitle>
                <DialogDescription>
                  Select one or more attachments from the list below
                </DialogDescription>
              </DialogHeader>
              <div className='flex-1 overflow-auto'>
                <DataTableSkeleton
                  columnCount={6}
                  rowCount={10}
                  withViewOptions
                />
              </div>
              <DialogFooter className='gap-2'>
                <Button variant='outline' onClick={dialog.close}>
                  Close
                </Button>
                <Button disabled>Confirm</Button>
              </DialogFooter>
            </div>
          }
        >
          <SelectAttachmentsContent
            getSelectedAttachmentIds={getSelectedAttachmentIds}
            onSubmit={onSubmit}
            dialog={dialog}
          />
        </Suspense>
      </DialogContent>
    </AppDialog>
  )
}
