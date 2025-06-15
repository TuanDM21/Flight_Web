import { differenceInMinutes, format } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'
import { dateFormatPatterns } from '@/config/date'
import { Clock, Hash, FileText, HardDrive, Calendar, Users } from 'lucide-react'
import { formatFileSize } from '@/lib/format'
import { useDialogs } from '@/hooks/use-dialogs'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { AttachmentDetailSheet } from '../components/attachment-detail-sheet'
import { AttachmentRowActions } from '../components/attachment-row-actions'
import { FileExtensionCell } from '../components/file-extension-cell'
import { FileNameCell } from '../components/file-name-cell'
import { SharedCountCell } from '../components/shared-count-cell'
import { AttachmentItem } from '../types'

interface UseAttachmentTableColumnsOptions {
  showColumns?: {
    shared?: boolean
    actions?: boolean
  }
}

export const useAttachmentTableColumns = (
  options: UseAttachmentTableColumnsOptions = {}
): ColumnDef<AttachmentItem>[] => {
  const {
    showColumns = {
      fileType: true,
      shared: true,
      actions: true,
    },
  } = options

  const dialogs = useDialogs()

  const handleViewDetails = (attachment: AttachmentItem) => {
    dialogs.sheet(AttachmentDetailSheet, {
      attachment,
    })
  }

  const baseColumns: ColumnDef<AttachmentItem>[] = [
    // Always show: select, id, fileName, fileSize, uploadDate
    {
      id: 'select',
      size: 32,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'id',
      accessorKey: 'id',
      size: 40,
      enableColumnFilter: true,
      meta: {
        className: '',
        label: 'ID',
        placeholder: 'Search ID...',
        variant: 'text',
        icon: Hash,
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ID' />
      ),
      cell: ({ cell }) => {
        const attachmentId = cell.getValue<number>()
        return (
          <Button
            variant='link'
            size='sm'
            className='h-auto p-0'
            onClick={() => handleViewDetails(cell.row.original)}
          >
            #{attachmentId ?? 'N/A'}
          </Button>
        )
      },
    },
    {
      id: 'fileName',
      accessorKey: 'fileName',
      enableColumnFilter: true,
      meta: {
        className: '',
        label: 'File Name',
        placeholder: 'Search file name...',
        variant: 'text',
        icon: FileText,
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='File Name' />
      ),
      cell: ({ row }) => <FileNameCell fileName={row.getValue('fileName')} />,
      minSize: 200,
    },
    {
      id: 'fileSize',
      accessorKey: 'fileSize',
      size: 40,
      enableColumnFilter: true,
      meta: {
        className: '',
        label: 'File Size',
        placeholder: 'Filter by file size...',
        variant: 'number',
        icon: HardDrive,
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Size' />
      ),
      cell: ({ row }) => {
        const size = (row.getValue('fileSize') as number) || 0
        return (
          <span className='text-muted-foreground text-sm'>
            {formatFileSize(size)}
          </span>
        )
      },
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      size: 40,
      enableColumnFilter: true,
      meta: {
        className: '',
        label: 'Upload Date',
        placeholder: 'Filter by upload date...',
        variant: 'date',
        icon: Calendar,
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Uploaded Date' />
      ),
      cell: ({ row }) => {
        const dateValue = row.getValue('createdAt') as string
        if (!dateValue) return <span className='text-muted-foreground'>-</span>

        const date = new Date(dateValue)
        const now = new Date()
        const isRecent = differenceInMinutes(now, date) <= 5

        return (
          <div className='bg-muted inline-flex items-center rounded px-2 py-1 text-xs whitespace-nowrap'>
            <span
              className={`text-sm ${isRecent ? 'font-medium text-green-600' : ''}`}
            >
              {isRecent && <Clock className='mr-1 inline-block h-4 w-4' />}
              {format(date, dateFormatPatterns.fullDate)}
              {isRecent && ' (New)'}
            </span>
          </div>
        )
      },
    },
  ]

  const optionalColumns: ColumnDef<AttachmentItem>[] = []

  optionalColumns.push({
    id: 'fileType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='File Type' />
    ),
    cell: ({ row }) => {
      const fileName = row.getValue('fileName') as string
      return <FileExtensionCell fileName={fileName} />
    },
    size: 80,
  })

  // Add shared column if enabled
  if (showColumns.shared) {
    optionalColumns.push({
      id: 'shared',
      size: 50,
      enableColumnFilter: true,
      meta: {
        className: '',
        label: 'Shared',
        placeholder: 'Filter by shared status...',
        variant: 'number',
        icon: Users,
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Shared' />
      ),
      cell: ({ row }) => {
        const attachment = row.original
        return (
          <SharedCountCell
            attachment={attachment}
            onViewDetails={handleViewDetails}
          />
        )
      },
    })
  }

  // Add actions column if enabled
  if (showColumns.actions) {
    optionalColumns.push({
      id: 'actions',
      size: 20,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Actions' />
      ),
      cell: ({ row }) => {
        const attachment = row.original
        return <AttachmentRowActions attachment={attachment} />
      },
    })
  }

  return [...baseColumns, ...optionalColumns]
}
