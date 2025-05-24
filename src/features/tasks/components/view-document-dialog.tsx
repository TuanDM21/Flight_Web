import { useState } from 'react'
import { format } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'
import { IconTrash } from '@tabler/icons-react'
import { dateFormatPatterns } from '@/config/date'
import { FileChartPie, FilePlus2Icon, MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { useTasks } from '@/context/task'
import { useDataTable } from '@/hooks/use-data-table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { TaskDocument } from '@/features/tasks/types'
import { useDeleteBulkTaskDocumentsMutation } from '../hooks/use-delete-bulk-task-documents'
import { useViewTaskDocuments } from '../hooks/use-view-task-documents'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  taskId: number
}

export function ViewDocumentDialog({ open, onOpenChange, taskId }: Props) {
  const { data: taskDocuments, isLoading: isTaskDocumentsLoading } =
    useViewTaskDocuments(taskId)

  const { setOpenSelectDocuments } = useTasks()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const documentColumns: ColumnDef<TaskDocument>[] = [
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
      size: 64,
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
      cell: ({ cell }) => <div>#{cell.getValue<number>() || 'N/A'}</div>,
      size: 70,
      enableSorting: false,
    },
    {
      id: 'documentType',
      accessorKey: 'documentType',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Type' />
      ),
      cell: ({ cell }) => <div>{cell.getValue<string>() || 'N/A'}</div>,
      size: 120,
      enableSorting: false,
    },
    {
      id: 'content',
      accessorKey: 'content',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Content' />
      ),
      cell: ({ cell }) => (
        <div className='max-w-[300px] truncate'>
          {cell.getValue<string>() || 'N/A'}
        </div>
      ),
      enableSorting: false,
    },
    {
      id: 'notes',
      accessorKey: 'notes',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Notes' />
      ),
      cell: ({ cell }) => (
        <div className='max-w-[200px] truncate'>
          {cell.getValue<string>() || 'No notes'}
        </div>
      ),
      enableSorting: false,
    },
    {
      id: 'attachments',
      accessorKey: 'attachments',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Attachments' />
      ),
      cell: ({ row }) => {
        const attachments = row.original.attachments || []
        const hasAttachments = attachments.length > 0

        return (
          <div className='flex items-center gap-2'>
            <span>{attachments.length} file(s)</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                  <span className='sr-only'>View files</span>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>
                  Attachments ({attachments.length})
                </DropdownMenuLabel>
                {hasAttachments ? (
                  attachments.map((attachment: any, index: number) => (
                    <DropdownMenuItem
                      key={index}
                      onSelect={() => window.open(attachment.url, '_blank')}
                    >
                      {attachment.name || `File ${index + 1}`}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>
                    No attachments available
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
      size: 150,
      enableSorting: false,
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Created At' />
      ),
      cell: ({ cell }) => {
        const value = cell.getValue<string>()
        if (!value) return <div>Unknown date</div>

        const date = new Date(value)
        return <div>{format(date, dateFormatPatterns.fullDateTime)}</div>
      },
      enableSorting: false,
    },
  ]

  const { table: documentsTable } = useDataTable({
    data: taskDocuments?.data || [],
    columns: documentColumns,
    pageCount: 1,
  })

  const selectedDocumentRows = documentsTable.getFilteredSelectedRowModel().rows
  const deleteBulkTaskDocumentsMutation = useDeleteBulkTaskDocumentsMutation()

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      documentsTable.resetRowSelection()
    }
    onOpenChange(isOpen)
  }

  const handleDeleteTaskDocuments = () => {
    setShowDeleteConfirm(true)
  }

  const confirmDeleteTaskDocuments = () => {
    if (!taskId) return

    const deleteDocumentIds = selectedDocumentRows.map(
      (row) => row.original.id
    ) as number[]

    const promise = deleteBulkTaskDocumentsMutation.mutateAsync({
      params: {
        query: {
          taskId: taskId,
        },
      },
      body: deleteDocumentIds,
    })

    toast.promise(promise, {
      loading: 'Deleting task documents...',
      success: 'Task documents deleted successfully',
      error: 'Error deleting task documents',
    })

    documentsTable.resetRowSelection()
    setShowDeleteConfirm(false)
  }

  const handleAddDocument = () => {
    setOpenSelectDocuments(true)
  }

  const noDocuments = !taskDocuments?.data || taskDocuments.data.length === 0

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
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
                      disabled={deleteBulkTaskDocumentsMutation.isPending}
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
      </Dialog>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title='Delete Documents'
        destructive
        handleConfirm={confirmDeleteTaskDocuments}
        isLoading={deleteBulkTaskDocumentsMutation.isPending}
        desc={
          <div className='space-y-2'>
            <p className='text-muted-foreground text-sm'>
              You are about to delete{' '}
              <span className='text-foreground font-medium'>
                {selectedDocumentRows.length} document
                {selectedDocumentRows.length > 1 ? 's' : ''}
              </span>{' '}
              from this task.
            </p>
            <p className='text-muted-foreground text-sm'>
              All associated files and data will be permanently removed. This
              action cannot be undone.
            </p>
          </div>
        }
      />
    </>
  )
}
