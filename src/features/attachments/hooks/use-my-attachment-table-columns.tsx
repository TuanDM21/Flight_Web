import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'
import { dateFormatPatterns } from '@/config/date'
import { Clock } from 'lucide-react'
import { formatFileSize } from '@/lib/format'
import { useFileIconType } from '@/hooks/use-file-icon-type'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { AttachmentRowActions } from '../components/attachment-row-actions'
import { MyAttachmentItem } from '../types'

function FileNameCell({ fileName }: { fileName: string | undefined }) {
  const { getFileIcon } = useFileIconType()

  return (
    <div className='flex w-full items-center gap-2'>
      {fileName ? getFileIcon(fileName) : <div className='h-4 w-4' />}
      <span className='flex-1 truncate font-medium'>
        {fileName || 'Unknown file'}
      </span>
    </div>
  )
}

export const useMyAttachmentTableColumns =
  (): ColumnDef<MyAttachmentItem>[] => {
    return [
      {
        id: 'select',
        size: 32,
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
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
        accessorKey: 'id',
        size: 40,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='ID' />
        ),
        cell: ({ cell }) => {
          const attachmentId = cell.getValue<number>()
          return (
            <Button variant='link' size='sm' asChild className='h-auto p-0'>
              <Link
                to='/attachments/$attachment-id'
                params={{ 'attachment-id': String(attachmentId) }}
              >
                #{attachmentId ?? 'N/A'}
              </Link>
            </Button>
          )
        },
      },
      {
        accessorKey: 'fileName',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='File Name' />
        ),
        cell: ({ row }) => <FileNameCell fileName={row.getValue('fileName')} />,
        minSize: 200,
      },
      {
        id: 'fileExtension',
        size: 32,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='File Type' />
        ),
        cell: ({ row }) => {
          const fileName = row.getValue('fileName') as string
          if (!fileName) return <span className='text-muted-foreground'>-</span>

          const extension = fileName.split('.').pop()?.toLowerCase() || ''
          return (
            <span className='text-muted-foreground font-mono text-sm'>
              {extension ? `.${extension}` : '-'}
            </span>
          )
        },
      },
      {
        accessorKey: 'fileSize',
        size: 40,
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
        accessorKey: 'createdAt',
        size: 40,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Uploaded Date' />
        ),
        cell: ({ row }) => {
          const dateValue = row.getValue('createdAt') as string
          if (!dateValue)
            return <span className='text-muted-foreground'>-</span>

          const date = new Date(dateValue)
          const now = new Date()
          const isRecent = now.getTime() - date.getTime() < 5 * 60 * 1000 // Within last 5 minutes

          return (
            <span
              className={`text-sm ${isRecent ? 'font-medium text-green-600' : ''}`}
            >
              {isRecent && <Clock className='mr-1 inline-block h-4 w-4' />}
              {format(date, dateFormatPatterns.fullDate)}
              {isRecent && ' (New)'}
            </span>
          )
        },
      },
      {
        id: 'actions',
        size: 32,
        cell: ({ row }) => {
          const attachment = row.original
          return <AttachmentRowActions attachment={attachment} />
        },
      },
    ]
  }
