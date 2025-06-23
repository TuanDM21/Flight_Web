import { useMemo } from 'react'
import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'
import { dateFormatPatterns } from '@/config/date'
import { Calendar, FileType, ScrollText, IdCard, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DocumentRowActions } from '../components/document-row-actions'
import { DocumentItem } from '../types'

export function useDocumentColumns(): ColumnDef<DocumentItem>[] {
  return useMemo(
    () => [
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
              aria-label='Chọn tất cả'
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
              aria-label='Chọn hàng'
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
          <DataTableColumnHeader column={column} title='ID Tài liệu' />
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
          label: 'ID Tài liệu',
          placeholder: 'Tìm kiếm ID tài liệu...',
          variant: 'text',
          icon: IdCard,
        },
        enableColumnFilter: true,
      },
      {
        id: 'documentType',
        accessorKey: 'documentType',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Loại tài liệu' />
        ),
        cell: ({ cell }) => (
          <div className='capitalize'>{cell.getValue<string>() ?? 'N/A'}</div>
        ),
        meta: {
          className: '',
          label: 'Loại tài liệu',
          placeholder: 'Tìm kiếm loại tài liệu...',
          variant: 'text',
          icon: FileType,
        },
        enableColumnFilter: true,
      },
      {
        id: 'content',
        accessorKey: 'content',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Nội dung' />
        ),
        cell: ({ cell }) => <div>{cell.getValue<string>() || 'N/A'}</div>,
        meta: {
          className: '',
          label: 'Nội dung',
          placeholder: 'Tìm kiếm nội dung...',
          variant: 'text',
          icon: ScrollText,
        },
        enableColumnFilter: true,
      },
      {
        id: 'createdAt',
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Ngày tạo' />
        ),
        cell: ({ cell }) => {
          const value = cell.getValue<string | undefined>()
          if (!value) return <div>Chưa thiết lập</div>

          const date = new Date(value)
          return <div>{format(date, dateFormatPatterns.fullDateTime)}</div>
        },
        meta: {
          className: '',
          label: 'Ngày tạo',
          placeholder: 'Lọc theo ngày tạo...',
          variant: 'date',
          icon: Calendar,
        },
        enableColumnFilter: true,
      },
      {
        id: 'updatedAt',
        accessorKey: 'updatedAt',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Ngày cập nhật' />
        ),
        cell: ({ cell }) => {
          const value = cell.getValue<string | undefined>()
          if (!value) return <div>Chưa thiết lập</div>

          const date = new Date(value)
          return <div>{format(date, dateFormatPatterns.fullDateTime)}</div>
        },
        meta: {
          className: '',
          label: 'Ngày cập nhật',
          placeholder: 'Lọc theo ngày cập nhật...',
          variant: 'date',
          icon: Clock,
        },
        enableColumnFilter: true,
      },
      {
        id: 'actions',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Hành động' />
        ),
        cell: ({ row }) => {
          return <DocumentRowActions row={row} />
        },
        size: 20,
        meta: {
          className: 'sticky right-0 bg-background border-l',
        },
      },
    ],
    []
  )
}
