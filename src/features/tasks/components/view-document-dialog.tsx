import React from 'react'
import { format } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'
import { IconTrash } from '@tabler/icons-react'
import { dateFormatPatterns } from '@/config/date'
import { Task, TaskDocument } from '@/types/task'
import { MoreHorizontal, Trash } from 'lucide-react'
import { useTasks } from '@/context/task'
import { useDataTable } from '@/hooks/use-data-table'
import { Button } from '@/components/ui/button'
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
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: Task | null
}

export function ViewDocumentDialog({ open, onOpenChange, currentRow }: Props) {
  const { setCurrentRow, setCurrentDocumentRow, setOpen } = useTasks()

  const documentColumns: ColumnDef<TaskDocument>[] = [
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
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Actions' />
      ),
      cell: ({ row }) => {
        const document = row.original

        return (
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8'
            onClick={() => {
              setCurrentRow(currentRow)
              setCurrentDocumentRow(document)
              setOpen('delete-document')
            }}
          >
            <Trash className='text-destructive h-4 w-4' />
            <span className='sr-only'>Delete</span>
          </Button>
        )
      },
      enableSorting: false,
    },
  ]
  const { table: documentsTable } = useDataTable({
    data: currentRow?.documents || [],
    columns: documentColumns,
    pageCount: 1,
  })

  const noDocuments =
    !currentRow?.documents || currentRow.documents.length === 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-7xl flex flex-col sm:max-w-7xl'>
        <DialogHeader className='pb-4'>
          <DialogTitle>All Documents for Task #{currentRow?.id}</DialogTitle>
          <p className='text-muted-foreground mt-1 text-sm'>
            View all documents for this task
          </p>
        </DialogHeader>

        <div className='p-6 pt-3'>
          {noDocuments ? (
            <div className='text-muted-foreground flex h-[200px] items-center justify-center py-8'>
              No documents available
            </div>
          ) : (
            <DataTable table={documentsTable} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
