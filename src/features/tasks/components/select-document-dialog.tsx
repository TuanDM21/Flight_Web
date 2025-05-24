import { useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { FileText, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useTasks } from '@/context/task'
import { useDataTable } from '@/hooks/use-data-table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { useViewDocuments } from '@/features/documents/hooks/use-view-documents'
import { TaskDocument, TaskDocumentAttachment } from '@/features/tasks/types'
import { useInsertBulkTaskDocumentsMutation } from '../hooks/use-insert-bulk-task-document'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  getSelectedDocumentIds: () => number[]
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
    cell: ({ cell }) => <div>#{cell.getValue<number>() ?? 'N/A'}</div>,
    enableColumnFilter: false,
  },
  {
    accessorKey: 'documentType',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Type' />
    },
    cell: ({ row }) => (
      <div className='capitalize'>{row.getValue('documentType')}</div>
    ),
  },
  {
    accessorKey: 'content',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Content' />
    },
    cell: ({ row }) => <div>{row.getValue('content')}</div>,
    enableColumnFilter: false,
  },
  {
    accessorKey: 'notes',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Notes' />
    },
    cell: ({ row }) => <div>{row.getValue('notes')}</div>,
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
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-6 px-2 text-xs'
                    >
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
]

export function SelectDocumentDialog({
  open,
  onOpenChange,
  getSelectedDocumentIds,
}: Props) {
  const { data: allDocuments, isLoading } = useViewDocuments()

  const availableDocuments = useMemo(() => {
    if (!allDocuments?.data) return []
    const selectedDocumentIds = getSelectedDocumentIds()
    return allDocuments.data.filter(
      (doc) => !selectedDocumentIds.includes(doc.id!)
    )
  }, [allDocuments, getSelectedDocumentIds])

  const { currentTaskId } = useTasks()
  const updateTaskDocumentsMutation =
    useInsertBulkTaskDocumentsMutation(currentTaskId)

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

    const documentIds = selectedDocuments.map((doc) => doc.id) as number[]

    const updateDocumentsPromise = updateTaskDocumentsMutation.mutateAsync({
      body: documentIds,
      params: {
        query: { taskId: currentTaskId ?? -1 },
      },
    })

    toast.promise(updateDocumentsPromise, {
      loading: `Updating documents...`,
      success: `Documents updated successfully!`,
      error: `Failed to update documents. Please try again.`,
    })

    onOpenChange(false)
    table.resetRowSelection()
    table.setColumnFilters([])
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
      }}
    >
      <DialogContent className='max-h-7xl flex flex-col sm:max-w-7xl'>
        <DialogHeader className='text-left'>
          <DialogTitle>Select Documents</DialogTitle>
          <DialogDescription>
            Select one or more documents from the list below
          </DialogDescription>
        </DialogHeader>
        <div className='flex-1 overflow-hidden'>
          {isLoading || updateTaskDocumentsMutation.isPending ? (
            <DataTableSkeleton columnCount={10} rowCount={10} withViewOptions />
          ) : noDocuments ? (
            <EmptyState />
          ) : (
            <ScrollArea className='h-full'>
              <DataTable table={table} />
            </ScrollArea>
          )}
        </div>
        <DialogFooter className='gap-2'>
          <DialogClose asChild>
            <Button variant='outline'>Close</Button>
          </DialogClose>
          <Button
            onClick={handleSaveSelection}
            disabled={
              isLoading ||
              noDocuments ||
              table.getFilteredSelectedRowModel().rows.length === 0
            }
          >
            {updateTaskDocumentsMutation.isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Updating...
              </>
            ) : (
              'Confirm'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
