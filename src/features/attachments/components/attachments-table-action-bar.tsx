import { Table } from '@tanstack/react-table'
import { Download, Trash2, Archive } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from '@/components/data-table/data-table-action-bar'
import { useDeleteAttachmentsConfirm } from '../hooks/use-delete-attachments-confirm'
import { MyAttachmentItem } from '../types'

interface AttachmentsTableActionBarProps {
  table: Table<MyAttachmentItem>
}

export function AttachmentsTableActionBar({
  table,
}: AttachmentsTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows
  const attachments = rows.map((row) => row.original)

  const { onDeleteAttachments, isAttachmentsDeleting } =
    useDeleteAttachmentsConfirm()

  const handleBulkDownload = async () => {}

  const handleBulkArchive = () => {
    const validAttachments = attachments.filter((a) => a.fileName)
    console.log(
      'Archiving files:',
      validAttachments.map((a) => a.fileName)
    )
  }

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
          tooltip='Download selected files'
          onClick={handleBulkDownload}
        >
          <Download />
        </DataTableActionBarAction>
        <DataTableActionBarAction
          size='icon'
          tooltip='Archive selected files'
          onClick={handleBulkArchive}
        >
          <Archive />
        </DataTableActionBarAction>
        <DataTableActionBarAction
          size='icon'
          tooltip='Delete selected files'
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
