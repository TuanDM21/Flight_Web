import { useState } from 'react'
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { DataTable } from '@/components/data-table/data-table'
import { useMyAttachmentTableColumns } from '../hooks/use-my-attachment-table-columns'
import { MyAttachmentItem } from '../types'
import { AttachmentsTableActionBar } from './attachments-table-action-bar'
import { AttachmentsTableToolbar } from './attachments-table-toolbar'

interface AttachmentsTableProps {
  data: MyAttachmentItem[]
}

export function AttachmentsTable({ data }: AttachmentsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const myAttachmentsColumns = useMyAttachmentTableColumns()

  const table = useReactTable({
    data,
    columns: myAttachmentsColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className='space-y-4'>
      <AttachmentsTableToolbar table={table} />
      <DataTable
        table={table}
        actionBar={<AttachmentsTableActionBar table={table} />}
      />
    </div>
  )
}
