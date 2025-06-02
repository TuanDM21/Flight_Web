import { format } from 'date-fns'
import { InfoIcon } from 'lucide-react'
import { formatFileSize } from '@/lib/format'
import { AppDialogInstance } from '@/hooks/use-dialog-instance'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { AppSheet } from '@/components/app-sheet'
import { MyAttachmentItem } from '../types'

interface AttachmentInfoSheetProps {
  attachment: MyAttachmentItem
  dialog?: AppDialogInstance
}

export function AttachmentInfoSheet({
  attachment,
  dialog,
}: AttachmentInfoSheetProps) {
  return (
    <AppSheet dialog={dialog}>
      <SheetContent className='w-full sm:max-w-2xl'>
        <SheetHeader>
          <SheetTitle className='flex items-center gap-2'>
            <InfoIcon className='h-5 w-5' />
            File Information
          </SheetTitle>
          <SheetDescription>
            Detailed information about the selected file.
          </SheetDescription>
        </SheetHeader>

        <div className='flex min-h-0 flex-1 flex-col gap-4 p-4'>
          {/* Who has access section */}
          <div className='space-y-3'>
            <h4 className='text-muted-foreground text-sm font-medium tracking-wide uppercase'>
              Who has access
            </h4>

            {/* Avatar List */}
            <div className='flex items-center gap-3'>
              {/* Owner Avatar */}
              <Avatar className='h-10 w-10 border-2 border-white shadow-sm'>
                <AvatarFallback className='bg-blue-100 font-semibold text-blue-600'>
                  {attachment.uploadedBy?.name?.charAt(0)?.toUpperCase() || 'O'}
                </AvatarFallback>
              </Avatar>

              {/* Team Members Avatars with different colors */}
              <Avatar className='h-10 w-10 border-2 border-white shadow-sm'>
                <AvatarFallback className='bg-green-100 font-semibold text-green-600'>
                  DB
                </AvatarFallback>
              </Avatar>

              <Avatar className='h-10 w-10 border-2 border-white shadow-sm'>
                <AvatarFallback className='bg-purple-100 font-semibold text-purple-600'>
                  HQ
                </AvatarFallback>
              </Avatar>

              <Avatar className='h-10 w-10 border-2 border-white shadow-sm'>
                <AvatarFallback className='bg-orange-100 font-semibold text-orange-600'>
                  DP
                </AvatarFallback>
              </Avatar>

              <Avatar className='h-10 w-10 border-2 border-white shadow-sm'>
                <AvatarFallback className='bg-pink-100 font-semibold text-pink-600'>
                  IH
                </AvatarFallback>
              </Avatar>

              <Button
                variant='ghost'
                size='sm'
                className='flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-gray-50 p-0 text-sm font-medium text-gray-500 transition-colors hover:border-gray-400 hover:bg-gray-100'
              >
                +4
              </Button>

              {/* Globe Icon for Public Access */}
              <div className='flex h-10 w-10 items-center justify-center rounded-full border-2 border-green-200 bg-green-100'>
                <svg
                  className='h-5 w-5 text-green-600'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* File Details */}
          <Separator />
          <div className='space-y-4'>
            <h4 className='text-muted-foreground text-sm font-medium tracking-wide uppercase'>
              File Details
            </h4>

            <div className='space-y-3'>
              {/* Size */}
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Size</span>
                <span className='text-muted-foreground text-sm'>
                  {attachment.fileSize
                    ? formatFileSize(attachment.fileSize)
                    : 'Unknown'}
                </span>
              </div>

              {/* Owner */}
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Owner</span>
                <span className='text-muted-foreground text-sm'>
                  {attachment.uploadedBy?.name || 'me'}
                </span>
              </div>

              {/* Modified */}
              {attachment.createdAt && (
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Modified</span>
                  <span className='text-muted-foreground text-sm'>
                    {format(new Date(attachment.createdAt), 'MMM dd, yyyy')} by{' '}
                    {attachment.uploadedBy?.name || 'me'}
                  </span>
                </div>
              )}

              {/* Created */}
              {attachment.createdAt && (
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Created</span>
                  <span className='text-muted-foreground text-sm'>
                    {format(new Date(attachment.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </AppSheet>
  )
}

AttachmentInfoSheet.useDialog = AppSheet.useDialog
