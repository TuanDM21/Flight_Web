import { CalendarIcon, FileIcon, HardDriveIcon, UsersIcon } from 'lucide-react'
import { formatFileSize } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MyAttachmentItem } from '../types'

interface AttachmentsStatsProps {
  data: MyAttachmentItem[]
}

export function AttachmentsStats({ data }: AttachmentsStatsProps) {
  const totalFiles = data.length
  const totalSize = data.reduce((acc, file) => acc + (file.fileSize || 0), 0)
  const uniqueUploaders = new Set(
    data
      .map((file) => file.uploadedBy?.id)
      .filter((id): id is number => id !== undefined)
  ).size
  const filesThisMonth = data.filter((file) => {
    if (!file.createdAt) return false
    const fileDate = new Date(file.createdAt)
    const now = new Date()
    return (
      fileDate.getMonth() === now.getMonth() &&
      fileDate.getFullYear() === now.getFullYear()
    )
  }).length

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Files</CardTitle>
          <FileIcon className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            {totalFiles.toLocaleString()}
          </div>
          <p className='text-muted-foreground text-xs'>All uploaded files</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Total Size</CardTitle>
          <HardDriveIcon className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{formatFileSize(totalSize)}</div>
          <p className='text-muted-foreground text-xs'>Storage used</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Contributors</CardTitle>
          <UsersIcon className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{uniqueUploaders}</div>
          <p className='text-muted-foreground text-xs'>Unique uploaders</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>This Month</CardTitle>
          <CalendarIcon className='text-muted-foreground h-4 w-4' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{filesThisMonth}</div>
          <p className='text-muted-foreground text-xs'>Files uploaded</p>
        </CardContent>
      </Card>
    </div>
  )
}
