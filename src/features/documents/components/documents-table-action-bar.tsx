'use client'

import { Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from '@/components/data-table/data-table-action-bar'
import { useDeleteDocumentsConfirm } from '../hooks/use-delete-documents-confirm'
import { DocumentItem } from '../types'

interface DocumentsTableActionBarProps {
  table: Table<DocumentItem>
}
export function DocumentsTableActionBar({
  table,
}: DocumentsTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows
  const { onDeleteDocuments } = useDeleteDocumentsConfirm()

  const handleDeleteSelected = () => {
    const selectedDocuments = rows.map((row) => row.original)
    onDeleteDocuments(selectedDocuments)
  }

  return (
    <DataTableActionBar table={table} visible={rows.length > 0}>
      <DataTableActionBarSelection table={table} />
      <Separator
        orientation='vertical'
        className='hidden data-[orientation=vertical]:h-5 sm:block'
      />
      <div className='flex items-center gap-1.5'>
        <DataTableActionBarAction
          size='icon'
          tooltip='Xóa tài liệu'
          onClick={handleDeleteSelected}
        >
          <Trash2 />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  )
}
