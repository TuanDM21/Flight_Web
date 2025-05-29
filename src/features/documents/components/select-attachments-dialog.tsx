import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { FileText, Eye } from 'lucide-react'
import { useDataTable } from '@/hooks/use-data-table'
import { AppDialogInstance } from '@/hooks/use-dialog-instance'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AppDialog } from '@/components/app-dialog'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { useViewAttachments } from '@/features/attachments/hooks/use-view-attachments'
import { DocumentAttachment } from '../types'

interface SelectAttachmentDialogProps {
  getSelectedAttachmentIds: () => number[]
  onSubmit: (attachments: Required<DocumentAttachment>[]) => void
  dialog: AppDialogInstance
}

const columns: ColumnDef<DocumentAttachment>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className='px-4 py-2'>
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value)
          }}
          aria-label='Select all'
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className='px-4 py-2'>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value)
          }}
          aria-label='Select row'
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: 'sticky left-0 bg-background border-r',
    },
  },
  {
    id: 'id',
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ cell }) => <div>#{cell.getValue<number>() ?? 'N/A'}</div>,
    enableColumnFilter: false,
  },
  {
    accessorKey: 'fileName',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='File Name' />
    },
    cell: ({ row }) => (
      <div className='max-w-[200px] truncate'>{row.getValue('fileName')}</div>
    ),
    enableColumnFilter: false,
  },
  {
    accessorKey: 'fileSize',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='File size' />
    },
    cell: ({ row }) => (
      <div className='whitespace-nowrap'>
        {Number(row.getValue('fileSize')) > 0
          ? `${(Number(row.getValue('fileSize')) / 1024 / 1024).toFixed(2)} MB`
          : 'N/A'}
      </div>
    ),
    enableColumnFilter: false,
  },
  {
    accessorKey: 'createdAt',
    header: () => <div>Created</div>,
    cell: ({ row }) => {
      const createdAt = row.original.createdAt

      return (
        <div className='flex flex-wrap items-center gap-1'>
          {createdAt ? (
            <div className='bg-muted inline-flex items-center rounded px-2 py-1 text-xs whitespace-nowrap'>
              {new Date(createdAt).toLocaleDateString()}
            </div>
          ) : (
            <span className='text-muted-foreground text-xs whitespace-nowrap'>
              No date available
            </span>
          )}
        </div>
      )
    },
    enableColumnFilter: false,
  },
  {
    id: 'actions',
    header: () => <div>Actions</div>,
    cell: ({ row }) => {
      const attachment = row.original

      const handlePreview = () => {
        if (attachment.filePath) {
          window.open(attachment.filePath, '_blank')
        }
      }

      return (
        <div className='flex items-center'>
          <Button
            variant='ghost'
            size='sm'
            onClick={handlePreview}
            disabled={!attachment.filePath}
            className='h-8 w-8 p-0'
          >
            <Eye className='h-4 w-4' />
            <span className='sr-only'>Preview attachment</span>
          </Button>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
  },
]

export function SelectAttachmentsDialog({
  getSelectedAttachmentIds,
  onSubmit,
  dialog,
}: SelectAttachmentDialogProps) {
  const { data: allAttachments, isLoading } = useViewAttachments()

  const availableAttachments = useMemo(() => {
    if (!allAttachments?.data) return []
    const selectedAttachmentIds = getSelectedAttachmentIds()
    return allAttachments.data.filter(
      (att) => !selectedAttachmentIds.includes(att.id!)
    )
  }, [allAttachments, getSelectedAttachmentIds])

  const { table } = useDataTable({
    data: availableAttachments,
    columns,
    pageCount: 1,
    getRowId: (row) => String(row.id ?? 'unknown'),
  })

  const noAttachments = availableAttachments.length === 0

  const EmptyState = () => (
    <div className='flex h-[400px] items-center justify-center'>
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
    <AppDialog dialog={dialog}>
      <DialogContent className='flex h-[80vh] max-h-[800px] flex-col sm:max-w-7xl'>
        <DialogHeader className='text-left'>
          <DialogTitle>Select Attachments</DialogTitle>
          <DialogDescription>
            Select one or more attachments from the list below
          </DialogDescription>
        </DialogHeader>
        <div className='flex-1 overflow-auto'>
          {isLoading ? (
            <DataTableSkeleton columnCount={10} rowCount={10} withViewOptions />
          ) : noAttachments ? (
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
              isLoading ||
              noAttachments ||
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
