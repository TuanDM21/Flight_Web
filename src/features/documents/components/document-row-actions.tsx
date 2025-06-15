import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useNavigate } from '@tanstack/react-router'
import { Row } from '@tanstack/react-table'
import { IconTrash } from '@tabler/icons-react'
import { PencilIcon } from 'lucide-react'
import { useDialogs } from '@/hooks/use-dialogs'
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
import { useDeleteDocumentConfirm } from '../hooks/use-delete-document-confirm'
import { useShowDocumentAttachments } from '../hooks/use-show-document-attachments'
import { DocumentItem } from '../types'

interface DocumentRowActionsProps<TData extends DocumentItem> {
  row: Row<TData>
}

export function DocumentRowActions<TData extends DocumentItem>({
  row,
}: DocumentRowActionsProps<TData>) {
  const document = row.original
  const navigate = useNavigate()
  const { closeAll } = useDialogs()

  const { onDeleteDocument } = useDeleteDocumentConfirm()
  const { showAttachments } = useShowDocumentAttachments()

  const attachments = document.attachments || []
  const hasAttachments = attachments.length > 0

  const handleShowAttachments = () => {
    showAttachments(Number(document.id))
  }

  const handleEdit = () => {
    closeAll()
    navigate({
      to: '/documents/$document-id/edit',
      params: { 'document-id': String(document.id!) },
    })
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Mở menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[260px]'>
          {hasAttachments ? (
            <DropdownMenuItem onClick={handleShowAttachments}>
              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center'>
                  <span>Xem tệp đính kèm</span>
                </div>
                <Badge variant='secondary' className='ml-2 text-xs'>
                  {attachments.length}
                </Badge>
              </div>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem>
              <div className='flex w-full items-center justify-between'>
                <span className='text-muted-foreground'>
                  Không có tệp đính kèm
                </span>
              </div>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleEdit}>
            Chỉnh sửa
            <DropdownMenuShortcut>
              <PencilIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDeleteDocument(document)}>
            Xóa
            <DropdownMenuShortcut>
              <IconTrash />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
