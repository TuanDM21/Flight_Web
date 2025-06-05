import React from 'react'
import { Download, Eye, File, Trash } from 'lucide-react'
import { formatFileSize } from '@/lib/format'
import { downloadFileFromUrl } from '@/utils/file'
import { DialogProps, useDialogs } from '@/hooks/use-dialogs'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTableActionBarAction } from '@/components/data-table/data-table-action-bar'
import { useDocumentDetail } from '../hooks/use-document-detail'
import { useDownloadAttachmentUrl } from '../hooks/use-download-attachment-url'
import { DocumentAttachment } from '../types'

interface AttachmentItemProps {
  attachment: DocumentAttachment
}

function AttachmentItem({ attachment }: AttachmentItemProps) {
  const dialogs = useDialogs()
  const { data: attachmentDownloadUrl } = useDownloadAttachmentUrl({
    attachmentId: attachment.id!,
  })

  const handleRemoveAttachment = React.useCallback(async () => {
    const confirmed = await dialogs.confirm(
      <div>
        <p>Are you sure you want to delete this attachment?</p>
        <p className='text-muted-foreground mt-2 text-sm'>
          File: {attachment.fileName}
        </p>
        <p className='text-muted-foreground text-sm'>
          This action cannot be undone.
        </p>
      </div>,
      {
        title: 'Delete Attachment',
        okText: 'Delete',
        cancelText: 'Cancel',
        severity: 'error',
      }
    )

    if (confirmed) {
      // TODO: Implement actual delete functionality
      console.log('Deleting attachment:', attachment.id)
    }
  }, [dialogs, attachment.fileName, attachment.id])

  const handleDownloadAttachment = React.useCallback(async () => {
    if (!attachmentDownloadUrl) return

    await downloadFileFromUrl({
      url: attachmentDownloadUrl.data!,
      filename: attachment.fileName ?? 'download',
    })
  }, [attachmentDownloadUrl?.data])

  return (
    <div className='group hover:bg-muted/60 flex items-center justify-between gap-4 rounded-lg border p-4 transition-colors'>
      <div className='flex min-w-0 flex-1 items-center gap-3'>
        <div className='flex-shrink-0'>
          <File className='text-primary/80 h-7 w-7' />
        </div>
        <div className='min-w-0 flex-1'>
          <p className='text-foreground truncate text-base font-medium'>
            {attachment.fileName || 'Unknown file'}
          </p>
          <p className='text-muted-foreground mt-0.5 text-xs'>
            {formatFileSize(attachment.fileSize || 0)}
          </p>
        </div>
      </div>
      <div className='flex flex-shrink-0 items-center gap-4'>
        <DataTableActionBarAction
          size='icon'
          tooltip='Remove file'
          onClick={handleRemoveAttachment}
          tabIndex={-1}
        >
          <Trash />
        </DataTableActionBarAction>
        <a href={attachment.filePath} target='_blank' rel='noopener noreferrer'>
          <DataTableActionBarAction
            size='icon'
            tooltip='View file'
            tabIndex={-1}
          >
            <Eye />
          </DataTableActionBarAction>
        </a>

        <DataTableActionBarAction
          size='icon'
          tooltip='Download file'
          tabIndex={-1}
          onClick={handleDownloadAttachment}
        >
          <Download />
        </DataTableActionBarAction>
      </div>
    </div>
  )
}

interface DocumentAttachmentsSheetPayload {
  documentId: number
}

interface DocumentAttachmentsSheetProps
  extends DialogProps<DocumentAttachmentsSheetPayload> {}

export function DocumentAttachmentsSheet({
  payload,
  open,
  onClose,
}: DocumentAttachmentsSheetProps) {
  const { documentId } = payload
  const { data: documentDetails, isLoading } = useDocumentDetail(documentId)

  const attachments = documentDetails?.data?.attachments || []

  const totalSize = attachments.reduce(
    (sum, attachment) => sum + (attachment.fileSize || 0),
    0
  )

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className='h-full w-full sm:max-w-2xl'>
        <SheetHeader className='space-y-3'>
          <SheetTitle className='flex items-center gap-2'>
            <File className='h-5 w-5' />
            Attachments
          </SheetTitle>
          <div className='text-muted-foreground text-sm'>
            {attachments.length} {attachments.length === 1 ? 'file' : 'files'} •{' '}
            {formatFileSize(totalSize)}
          </div>
        </SheetHeader>

        <div className='flex min-h-0 flex-1 flex-col gap-4 p-4'>
          <div className='min-h-0 flex-1 space-y-2 overflow-y-auto scroll-smooth'>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className='h-16 w-full rounded-lg' />
              ))
            ) : attachments.length === 0 ? (
              <div className='text-muted-foreground flex flex-col items-center justify-center py-12 text-center'>
                <File className='mb-2 h-8 w-8 opacity-40' />
                <div className='font-medium'>No attachments</div>
                <div className='text-xs'>This document has no attachments.</div>
              </div>
            ) : (
              attachments.map((attachment, index) => (
                <AttachmentItem
                  key={attachment.id || index}
                  attachment={attachment}
                />
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default DocumentAttachmentsSheet
