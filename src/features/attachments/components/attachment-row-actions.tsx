import {
  MoreHorizontalIcon,
  EyeIcon,
  DownloadIcon,
  TrashIcon,
  InfoIcon,
  Share2Icon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDeleteAttachmentsConfirm } from '../hooks/use-delete-attachments-confirm'
import { MyAttachmentItem } from '../types'
import { AttachmentInfoSheet } from './attachment-info-sheet'
import { AttachmentShareDialog } from './attachment-share-dialog'

interface AttachmentRowActionsProps {
  attachment: MyAttachmentItem
}

export function AttachmentRowActions({
  attachment,
}: AttachmentRowActionsProps) {
  const infoDialog = AttachmentInfoSheet.useDialog()
  const shareDialog = AttachmentShareDialog.useDialog()

  const { onDeleteAttachments, isAttachmentsDeleting } =
    useDeleteAttachmentsConfirm()

  const handleDownload = async () => {}

  const handleDelete = async () => {
    await onDeleteAttachments([attachment])
  }

  const handlePreview = () => {}

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontalIcon className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={() => shareDialog.open()}>
            <Share2Icon className='mr-2 h-4 w-4' />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => infoDialog.open()}>
            <InfoIcon className='mr-2 h-4 w-4' />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePreview}>
            <EyeIcon className='mr-2 h-4 w-4' />
            Preview
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownload}>
            <DownloadIcon className='mr-2 h-4 w-4' />
            Download
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={isAttachmentsDeleting}
          >
            <TrashIcon className='mr-2 h-4 w-4' />
            {isAttachmentsDeleting ? 'Deleting...' : 'Delete'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AttachmentInfoSheet attachment={attachment} dialog={infoDialog} />
      <AttachmentShareDialog attachment={attachment} dialog={shareDialog} />
    </>
  )
}
