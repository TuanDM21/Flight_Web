import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useNavigate } from '@tanstack/react-router'
import { Row } from '@tanstack/react-table'
import { IconTrash } from '@tabler/icons-react'
import { PencilIcon } from 'lucide-react'
import { useDialogInstance } from '@/hooks/use-dialog-instance'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AppConfirmDialog } from '@/components/app-confirm-dialog'
import { DocumentItem } from '../types'
import DeleteDocumentConfirmDialog from './delete-document-confirm-dialog'
import { DocumentAttachmentsSheet } from './document-attachments-sheet'

interface DocumentRowActionsProps<TData extends DocumentItem> {
  row: Row<TData>
}

export function DocumentRowActions<TData extends DocumentItem>({
  row,
}: DocumentRowActionsProps<TData>) {
  const document = row.original
  const navigate = useNavigate()

  const attachments = document.attachments || []
  const hasAttachments = attachments.length > 0

  const deleteDialogInstance = AppConfirmDialog.useDialog()
  const attachmentsDialogInstance = useDialogInstance()

  const confirmDeleteDocument = () => {
    deleteDialogInstance.open()
  }

  return (
    <>
      {deleteDialogInstance.isOpen && (
        <DeleteDocumentConfirmDialog
          documentId={Number(document.id)}
          dialog={deleteDialogInstance}
        />
      )}

      {attachmentsDialogInstance.isOpen && hasAttachments && (
        <DocumentAttachmentsSheet
          dialog={attachmentsDialogInstance}
          documentId={Number(document.id)}
        />
      )}

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[260px]'>
          {hasAttachments ? (
            <DropdownMenuItem onClick={attachmentsDialogInstance.open}>
              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center'>
                  <span>View attachments</span>
                </div>
                <Badge variant='secondary' className='ml-2 text-xs'>
                  {attachments.length}
                </Badge>
              </div>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem>
              <div className='flex w-full items-center justify-between'>
                <span className='text-muted-foreground'>No attachments</span>
              </div>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              navigate({
                to: '/documents/$document-id/edit',
                params: { 'document-id': String(document.id!) },
              })
            }}
          >
            Edit
            <DropdownMenuShortcut>
              <PencilIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={confirmDeleteDocument}>
            Delete
            <DropdownMenuShortcut>
              <IconTrash />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
