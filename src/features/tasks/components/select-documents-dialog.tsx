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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AppDialog } from '@/components/app-dialog'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { useViewDocuments } from '@/features/documents/hooks/use-view-documents'
import { TaskDocument, TaskDocumentAttachment } from '@/features/tasks/types'

interface SelectDocumentDialogProps {
  getSelectedDocumentIds: () => number[]
  onSubmit: (documents: TaskDocument[]) => void
  dialog: AppDialogInstance
}

const columns: ColumnDef<TaskDocument>[] = [
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
    accessorKey: 'documentType',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Type' />
    },
    cell: ({ row }) => (
      <div className='whitespace-nowrap capitalize'>
        {row.getValue('documentType')}
      </div>
    ),
  },
  {
    accessorKey: 'content',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Content' />
    },
    cell: ({ row }) => (
      <div className='max-w-[300px] truncate'>{row.getValue('content')}</div>
    ),
    enableColumnFilter: false,
  },
  {
    accessorKey: 'notes',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Notes' />
    },
    cell: ({ row }) => (
      <div className='max-w-[200px] truncate'>{row.getValue('notes')}</div>
    ),
    enableColumnFilter: false,
  },
  {
    accessorKey: 'attachments',
    header: () => <div>Attachments</div>,
    cell: ({ row }) => {
      const attachments = row.getValue(
        'attachments'
      ) as TaskDocumentAttachment[]
      const totalFiles = attachments.length

      return (
        <div className='flex flex-wrap items-center gap-1'>
          {totalFiles > 0 ? (
            <>
              {attachments.slice(0, 2).map((attachment, index) => (
                <div
                  key={index}
                  className='bg-muted inline-flex items-center rounded px-2 py-1 text-xs'
                >
                  {attachment.fileName}
                </div>
              ))}
              {totalFiles > 2 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='h-6 px-2 text-xs'>
                      +{totalFiles - 2} more files
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='start' className='w-56'>
                    <DropdownMenuLabel>All Attachments</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {attachments.map((attachment, index) => (
                      <DropdownMenuItem key={index}>
                        {attachment.fileName}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          ) : (
            <span className='text-muted-foreground text-xs'>
              No attachments available
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
      const document = row.original

      const handlePreview = () => {
        // You can implement document preview logic here
        // For example, if documents have a preview URL or content
        console.log('Preview document:', document)
      }

      return (
        <div className='flex items-center'>
          <Button
            variant='ghost'
            size='sm'
            onClick={handlePreview}
            className='h-8 w-8 p-0'
          >
            <Eye className='h-4 w-4' />
            <span className='sr-only'>Preview document</span>
          </Button>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
  },
]

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
    columns,
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
