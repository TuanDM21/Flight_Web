import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'
import { dateFormatPatterns } from '@/config/date'
import { CalendarSearch, FileText, FileTextIcon, Hash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DocumentRowActions } from './components/document-row-actions'
import type { DocumentItem } from './types'

export const documentColumns: ColumnDef<DocumentItem>[] = [
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
      <DataTableColumnHeader column={column} title='Document ID' />
    ),
    cell: ({ cell }) => {
      const documentId = cell.getValue<number>()
      return (
        <Button variant='link' size='sm' asChild className='h-auto p-0'>
          <Link
            to='/documents/$document-id'
            params={{ 'document-id': String(documentId) }}
          >
            #{documentId ?? 'N/A'}
          </Link>
        </Button>
      )
    },
    meta: {
      className: '',
      label: 'Document ID',
      placeholder: 'Search document ID...',
      variant: 'text',
      icon: Hash,
    },
    enableColumnFilter: true,
  },
  {
    id: 'documentType',
    accessorKey: 'documentType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Document Type' />
    ),
    cell: ({ cell }) => (
      <div className='capitalize'>{cell.getValue<string>() ?? 'N/A'}</div>
    ),
    meta: {
      className: '',
      label: 'Document Type',
      placeholder: 'Search document type...',
      variant: 'text',
      icon: FileText,
    },
    enableColumnFilter: true,
  },
  {
    id: 'content',
    accessorKey: 'content',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Content' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<string>() || 'N/A'}</div>,
    meta: {
      className: '',
      label: 'Content',
      placeholder: 'Search content...',
      variant: 'text',
      icon: FileTextIcon,
    },
    enableColumnFilter: true,
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ cell }) => {
      const value = cell.getValue<string | undefined>()
      if (!value) return <div>Not set</div>

      const date = new Date(value)
      return <div>{format(date, dateFormatPatterns.fullDateTime)}</div>
    },
    meta: {
      className: '',
      label: 'Created At',
      placeholder: 'Filter by creation date...',
      variant: 'date',
      icon: CalendarSearch,
    },
    enableColumnFilter: true,
  },
  {
    id: 'updatedAt',
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Updated At' />
    ),
    cell: ({ cell }) => {
      const value = cell.getValue<string | undefined>()
      if (!value) return <div>Not set</div>

      const date = new Date(value)
      return <div>{format(date, dateFormatPatterns.fullDateTime)}</div>
    },
    meta: {
      className: '',
      label: 'Updated At',
      placeholder: 'Filter by update date...',
      variant: 'date',
      icon: CalendarSearch,
    },
    enableColumnFilter: true,
  },
  {
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Actions' />
    ),
    cell: ({ row }) => {
      return <DocumentRowActions row={row} />
    },
    size: 20,
    meta: {
      className: 'sticky right-0 bg-background border-l',
    },
  },
]
