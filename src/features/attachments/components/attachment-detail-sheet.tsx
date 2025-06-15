import { Suspense } from 'react'
import { format } from 'date-fns'
import { InfoIcon } from 'lucide-react'
import { formatFileSize } from '@/lib/format'
import { DialogProps } from '@/hooks/use-dialogs'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { AttachmentItem } from '../types'
import { UserAccessAttachmentList } from './user-access-attachment-list'

interface AttachmentDetailSheetPayload {
  attachment: AttachmentItem
}

// Skeleton component for loading state
function AttachmentDetailSheetSkeleton() {
  return (
    <div className='flex min-h-0 flex-1 flex-col gap-4 p-4'>
      <Separator />
      {/* Who has access section skeleton */}
      <div className='flex min-h-0 flex-1 flex-col space-y-3'>
        <h4 className='text-muted-foreground text-sm font-medium tracking-wide uppercase'>
          Ai có quyền truy cập
        </h4>
        <div className='min-h-0 flex-1 overflow-hidden'>
          <div className='flex items-center gap-3'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className='bg-muted h-10 w-10 animate-pulse rounded-full'
              />
            ))}
            <div className='bg-muted h-10 w-10 animate-pulse rounded-full' />
          </div>
        </div>
      </div>

      <Separator />
      {/* File Details skeleton */}
      <div className='space-y-4'>
        <h4 className='text-muted-foreground text-sm font-medium tracking-wide uppercase'>
          Chi tiết tệp
        </h4>
        <div className='space-y-3'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='flex items-center justify-between'>
              <div className='bg-muted h-4 w-16 animate-pulse rounded' />
              <div className='bg-muted h-4 w-24 animate-pulse rounded' />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Main content component that uses Suspense
function AttachmentDetailSheetContent({
  attachment,
}: {
  attachment: AttachmentItem
}) {
  return (
    <div className='flex min-h-0 flex-1 flex-col gap-4 p-4'>
      <div className='flex min-h-0 flex-1 flex-col space-y-3'>
        <h4 className='text-muted-foreground text-sm font-medium tracking-wide uppercase'>
          Ai có quyền truy cập
        </h4>
        <div className='min-h-0 flex-1 overflow-hidden'>
          <UserAccessAttachmentList attachment={attachment} />
        </div>
      </div>

      <Separator />
      <div className='space-y-4'>
        <h4 className='text-muted-foreground text-sm font-medium tracking-wide uppercase'>
          Chi tiết tệp
        </h4>

        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium'>Kích thước</span>
            <span className='text-muted-foreground text-sm'>
              {attachment.fileSize
                ? formatFileSize(attachment.fileSize)
                : 'Không xác định'}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium'>Chủ sở hữu</span>
            <span className='text-muted-foreground text-sm'>
              {attachment.uploadedBy?.name || 'tôi'}
            </span>
          </div>
          {attachment.createdAt && (
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>Đã sửa đổi</span>
              <span className='text-muted-foreground text-sm'>
                {format(new Date(attachment.createdAt), 'MMM dd, yyyy')} bởi{' '}
                {attachment.uploadedBy?.name || 'tôi'}
              </span>
            </div>
          )}
          {attachment.createdAt && (
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>Được tạo</span>
              <span className='text-muted-foreground text-sm'>
                {format(new Date(attachment.createdAt), 'MMM dd, yyyy')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function AttachmentDetailSheet({
  payload,
  open,
  onClose,
}: DialogProps<AttachmentDetailSheetPayload>) {
  const { attachment } = payload

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className='w-full sm:max-w-2xl'>
        <SheetHeader>
          <SheetTitle className='flex items-center gap-2'>
            <InfoIcon className='h-5 w-5' />
            Thông tin tệp
          </SheetTitle>
          <SheetDescription>
            Thông tin chi tiết về tệp đã chọn.
          </SheetDescription>
        </SheetHeader>

        <Suspense fallback={<AttachmentDetailSheetSkeleton />}>
          <AttachmentDetailSheetContent attachment={attachment} />
        </Suspense>
      </SheetContent>
    </Sheet>
  )
}
