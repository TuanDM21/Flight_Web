import {
  MoreHorizontalIcon,
  EyeIcon,
  DownloadIcon,
  TrashIcon,
  InfoIcon,
  Share2Icon,
} from 'lucide-react'
import { useDialogs } from '@/hooks/use-dialogs'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDeleteAttachmentsConfirm } from '../hooks/use-delete-attachments-confirm'
import { AttachmentItem } from '../types'
import { AttachmentDetailSheet } from './attachment-detail-sheet'
import { AttachmentShareDialog } from './attachment-share-dialog'

interface AttachmentRowActionsProps {
  attachment: AttachmentItem
}

export function AttachmentRowActions({
  attachment,
}: AttachmentRowActionsProps) {
  const dialogs = useDialogs()

  // const { data: attachmentDownloadUrl } = useDownloadAttachmentUrl({
  //   attachmentId: attachment.id!,
  // })

  const { onDeleteAttachments, isAttachmentsDeleting } =
    useDeleteAttachmentsConfirm()

  const handleDownload = async () => {
    // if (!attachmentDownloadUrl) {
    //   toast.error('Failed to get download URL')
    //   return
    // }
    // await downloadFileFromUrl({
    //   url: attachmentDownloadUrl.data!,
    //   filename: attachment.fileName ?? 'download',
    // })
  }

  const handleDelete = async () => {
    await onDeleteAttachments([attachment])
  }

  const handlePreview = () => {
    window.open(attachment.filePath, '_blank', 'noopener,noreferrer')
  }

  const handleShare = () => {
    dialogs.open(AttachmentShareDialog, {
      attachment,
    })
  }

  const handleViewDetails = () => {
    dialogs.sheet(AttachmentDetailSheet, {
      attachment,
    })
  }

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
          <DropdownMenuItem onClick={handleShare}>
            <Share2Icon className='mr-2 h-4 w-4' />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleViewDetails}>
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
    </>
  )
}
