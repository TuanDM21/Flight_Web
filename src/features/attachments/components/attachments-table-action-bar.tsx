import { Table } from '@tanstack/react-table'
import { Download, Trash2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from '@/components/data-table/data-table-action-bar'
import { useDeleteAttachmentsConfirm } from '../hooks/use-delete-attachments-confirm'
import { AttachmentItem } from '../types'

interface AttachmentsTableActionBarProps {
  table: Table<AttachmentItem>
}

export function AttachmentsTableActionBar({
  table,
}: AttachmentsTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows
  const attachments = rows.map((row) => row.original)

  const { onDeleteAttachments, isAttachmentsDeleting } =
    useDeleteAttachmentsConfirm()

  const handleBulkDownload = async () => {}

  const handleBulkDelete = async () => {
    if (attachments.length === 0) return
    await onDeleteAttachments(attachments)
    table.toggleAllRowsSelected(false)
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
          tooltip='Tải xuống các tệp đã chọn'
          onClick={handleBulkDownload}
        >
          <Download />
        </DataTableActionBarAction>
        <DataTableActionBarAction
          size='icon'
          tooltip='Xóa các tệp đã chọn'
          onClick={handleBulkDelete}
          disabled={isAttachmentsDeleting}
          isPending={isAttachmentsDeleting}
        >
          <Trash2 />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  )
}
