import {
  ArrowDownTrayIcon,
  DocumentDuplicateIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/outline'
import { toast } from 'sonner'
import { formatDate, formatFileSize } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import type { DocumentItem } from '../types'

interface ViewDocumentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: DocumentItem
}

export function ViewDocumentDialog({
  open,
  onOpenChange,
  document,
}: ViewDocumentDialogProps) {
  const handleDownload = () => {
    if (document.url) {
      const link = window.document.createElement('a')
      link.href = document.url
      link.download = document.name
      link.click()
    }
  }

  const handleCopyLink = () => {
    if (document.url) {
      navigator.clipboard.writeText(document.url)
      toast.success('Link copied to clipboard')
    }
  }

  const isImage = document.mimeType?.startsWith('image/')
  const isVideo = document.mimeType?.startsWith('video/')
  const isAudio = document.mimeType?.startsWith('audio/')
  const isPdf = document.mimeType === 'application/pdf'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[80vh] overflow-y-auto sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <ArchiveBoxIcon className='h-5 w-5' />
            {document.name}
          </DialogTitle>
          <DialogDescription>Document details and preview</DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Preview Section */}
          {document.url && (
            <div className='space-y-2'>
              <h4 className='text-sm font-medium'>Preview</h4>
              <div className='overflow-hidden rounded-lg border'>
                {isImage && (
                  <img
                    src={document.url}
                    alt={document.name}
                    className='bg-muted max-h-64 w-full object-contain'
                  />
                )}
                {isVideo && (
                  <video
                    src={document.url}
                    controls
                    className='max-h-64 w-full'
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
                {isAudio && (
                  <div className='p-4'>
                    <audio src={document.url} controls className='w-full'>
                      Your browser does not support the audio tag.
                    </audio>
                  </div>
                )}
                {isPdf && (
                  <iframe
                    src={document.url}
                    className='h-64 w-full'
                    title={document.name}
                  />
                )}
                {!isImage && !isVideo && !isAudio && !isPdf && (
                  <div className='text-muted-foreground p-8 text-center'>
                    <ArchiveBoxIcon className='mx-auto mb-2 h-12 w-12 opacity-50' />
                    <p>Preview not available for this file type</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Document Information */}
          <div className='space-y-4'>
            <h4 className='text-sm font-medium'>Information</h4>

            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <TagIcon className='text-muted-foreground h-4 w-4' />
                  <span className='text-muted-foreground'>Type:</span>
                </div>
                <Badge variant='outline' className='capitalize'>
                  {document.type}
                </Badge>
              </div>

              {document.fileSize && (
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <ArchiveBoxIcon className='text-muted-foreground h-4 w-4' />
                    <span className='text-muted-foreground'>Size:</span>
                  </div>
                  <span>{formatFileSize(document.fileSize)}</span>
                </div>
              )}

              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <UserIcon className='text-muted-foreground h-4 w-4' />
                  <span className='text-muted-foreground'>Created by:</span>
                </div>
                <span>
                  {document.createdBy?.name ||
                    document.createdBy?.email ||
                    'Unknown'}
                </span>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <CalendarIcon className='text-muted-foreground h-4 w-4' />
                  <span className='text-muted-foreground'>Created:</span>
                </div>
                <span>{formatDate(document.createdAt)}</span>
              </div>
            </div>

            {document.mimeType && (
              <div className='space-y-2'>
                <span className='text-muted-foreground text-sm'>
                  MIME Type:
                </span>
                <code className='bg-muted block rounded px-2 py-1 text-xs'>
                  {document.mimeType}
                </code>
              </div>
            )}

            {document.description && (
              <div className='space-y-2'>
                <span className='text-muted-foreground text-sm'>
                  Description:
                </span>
                <p className='text-sm'>{document.description}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className='flex gap-2'>
            <Button onClick={handleDownload} className='flex-1'>
              <ArrowDownTrayIcon className='mr-2 h-4 w-4' />
              Download
            </Button>
            <Button
              variant='outline'
              onClick={handleCopyLink}
              className='flex-1'
            >
              <DocumentDuplicateIcon className='mr-2 h-4 w-4' />
              Copy Link
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
