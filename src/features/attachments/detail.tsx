import { format } from 'date-fns'
import { useSuspenseQuery } from '@tanstack/react-query'
import { AttachmentDetailRoute } from '@/routes/_authenticated/attachments/$attachment-id'
import {
  Download,
  FileText,
  Calendar,
  User,
  Users,
  Building,
  Shield,
  Share2,
  Eye,
} from 'lucide-react'
import { formatFileSize } from '@/lib/format'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Main } from '@/components/layout/main'
import { getAttachmentDetailQueryOptions } from './hooks/use-attachment-detail'
import { getUsersSharedWithFileQueryOptions } from './hooks/use-user-shared-with-file'

export default function AttachmentDetailPage() {
  const attachmentId = AttachmentDetailRoute.useParams()['attachment-id']

  const { data: attachmentDetail } = useSuspenseQuery(
    getAttachmentDetailQueryOptions(Number(attachmentId))
  )
  const { data: sharedUsers } = useSuspenseQuery(
    getUsersSharedWithFileQueryOptions(Number(attachmentId))
  )

  const attachment = attachmentDetail?.data
  const users = sharedUsers?.data || []

  if (!attachment) {
    return (
      <Main>
        <div className='flex h-96 items-center justify-center'>
          <p className='text-muted-foreground'>Attachment not found</p>
        </div>
      </Main>
    )
  }

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const uploadedBy = attachment.uploadedBy

  return (
    <Main>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-start justify-between'>
          <div className='space-y-1'>
            <h1 className='text-3xl font-bold tracking-tight'>
              {attachment.fileName || 'Unknown File'}
            </h1>
            <p className='text-muted-foreground'>
              Uploaded on{' '}
              {attachment.createdAt
                ? format(new Date(attachment.createdAt), 'PPP')
                : 'Unknown date'}
            </p>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' size='sm'>
              <Eye className='mr-2 h-4 w-4' />
              Preview
            </Button>
            <Button size='sm'>
              <Download className='mr-2 h-4 w-4' />
              Download
            </Button>
          </div>
        </div>

        <div className='grid gap-6 md:grid-cols-3'>
          {/* File Information */}
          <div className='space-y-6 md:col-span-2'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <FileText className='h-5 w-5' />
                  File Information
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid gap-4 sm:grid-cols-2'>
                  <div>
                    <p className='text-muted-foreground text-sm font-medium'>
                      File Name
                    </p>
                    <p className='text-sm'>
                      {attachment.fileName || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <p className='text-muted-foreground text-sm font-medium'>
                      File Size
                    </p>
                    <p className='text-sm'>
                      {formatFileSize(attachment.fileSize || 0)}
                    </p>
                  </div>
                  <div>
                    <p className='text-muted-foreground text-sm font-medium'>
                      File Path
                    </p>
                    <p className='bg-muted rounded p-2 font-mono text-xs break-all'>
                      {attachment.filePath || 'Unknown path'}
                    </p>
                  </div>
                  <div>
                    <p className='text-muted-foreground text-sm font-medium'>
                      Upload Date
                    </p>
                    <p className='flex items-center gap-1 text-sm'>
                      <Calendar className='h-4 w-4' />
                      {attachment.createdAt
                        ? format(new Date(attachment.createdAt), 'PPp')
                        : 'Unknown date'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Uploader Information */}
            {uploadedBy && (
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <User className='h-5 w-5' />
                    Uploaded By
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex items-start gap-4'>
                    <Avatar className='h-12 w-12'>
                      <AvatarImage src='' alt={uploadedBy.name || 'User'} />
                      <AvatarFallback>
                        {getUserInitials(uploadedBy.name || 'User')}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1 space-y-3'>
                      <div>
                        <p className='font-medium'>
                          {uploadedBy.name || 'Unknown User'}
                        </p>
                        <p className='text-muted-foreground text-sm'>
                          {uploadedBy.email || 'No email'}
                        </p>
                      </div>

                      <div className='grid gap-3 sm:grid-cols-2'>
                        <div className='flex items-center gap-2'>
                          <Shield className='text-muted-foreground h-4 w-4' />
                          <div>
                            <p className='text-sm font-medium'>Role</p>
                            <Badge variant='secondary'>
                              {uploadedBy.roleName || 'Unknown'}
                            </Badge>
                          </div>
                        </div>

                        {uploadedBy.teamName && (
                          <div className='flex items-center gap-2'>
                            <Users className='text-muted-foreground h-4 w-4' />
                            <div>
                              <p className='text-sm font-medium'>Team</p>
                              <p className='text-muted-foreground text-sm'>
                                {uploadedBy.teamName}
                              </p>
                            </div>
                          </div>
                        )}

                        {uploadedBy.unitName && (
                          <div className='flex items-center gap-2'>
                            <Building className='text-muted-foreground h-4 w-4' />
                            <div>
                              <p className='text-sm font-medium'>Unit</p>
                              <p className='text-muted-foreground text-sm'>
                                {uploadedBy.unitName}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className='flex items-center gap-2'>
                          <div>
                            <p className='text-sm font-medium'>
                              Can Create Activity
                            </p>
                            <Badge
                              variant={
                                uploadedBy.canCreateActivity
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {uploadedBy.canCreateActivity ? 'Yes' : 'No'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Permissions */}
                      {uploadedBy.permissions &&
                        uploadedBy.permissions.length > 0 && (
                          <div>
                            <p className='mb-2 text-sm font-medium'>
                              Permissions
                            </p>
                            <div className='flex flex-wrap gap-1'>
                              {uploadedBy.permissions.map(
                                (permission, index) => (
                                  <Badge
                                    key={index}
                                    variant='outline'
                                    className='text-xs'
                                  >
                                    {permission}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Shared Users */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Share2 className='h-5 w-5' />
                  Shared With ({users.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {users.length > 0 ? (
                  <div className='space-y-4'>
                    {users.map((user, index) => {
                      const sharedWith = user.sharedWith
                      const userName = sharedWith?.name || 'Unknown User'
                      const userEmail = sharedWith?.email || 'No email'
                      const permission = user.permission || 'READ_ONLY'
                      const isActive = user.active ?? true
                      const isExpired = user.expired ?? false

                      return (
                        <div
                          key={index}
                          className='bg-card flex items-start gap-3 rounded-lg border p-3'
                        >
                          <Avatar className='mt-0.5 h-10 w-10'>
                            <AvatarImage src='' alt={userName} />
                            <AvatarFallback className='text-xs'>
                              {getUserInitials(userName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className='min-w-0 flex-1 space-y-2'>
                            <div className='flex items-start justify-between'>
                              <div>
                                <p className='truncate text-sm font-medium'>
                                  {userName}
                                </p>
                                <p className='text-muted-foreground truncate text-xs'>
                                  {userEmail}
                                </p>
                                {sharedWith?.roleName && (
                                  <Badge
                                    variant='outline'
                                    className='mt-1 text-xs'
                                  >
                                    {sharedWith.roleName}
                                  </Badge>
                                )}
                              </div>
                              <div className='flex flex-col items-end gap-1'>
                                <Badge
                                  variant={
                                    permission === 'READ_ONLY'
                                      ? 'secondary'
                                      : 'default'
                                  }
                                  className='text-xs'
                                >
                                  {permission.replace('_', ' ')}
                                </Badge>
                                {isExpired && (
                                  <Badge
                                    variant='destructive'
                                    className='text-xs'
                                  >
                                    Expired
                                  </Badge>
                                )}
                                {!isActive && (
                                  <Badge variant='outline' className='text-xs'>
                                    Inactive
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className='text-muted-foreground grid gap-1 text-xs'>
                              {user.sharedAt && (
                                <p>
                                  Shared:{' '}
                                  {format(
                                    new Date(user.sharedAt),
                                    'MMM dd, yyyy'
                                  )}
                                </p>
                              )}
                              {user.expiresAt && (
                                <p>
                                  Expires:{' '}
                                  {format(
                                    new Date(user.expiresAt),
                                    'MMM dd, yyyy'
                                  )}
                                </p>
                              )}
                              {user.note && (
                                <p className='bg-muted mt-1 rounded p-2 text-xs'>
                                  Note: {user.note}
                                </p>
                              )}
                            </div>

                            {sharedWith?.teamName && (
                              <div className='text-muted-foreground flex items-center gap-1 text-xs'>
                                <Users className='h-3 w-3' />
                                {sharedWith.teamName}
                                {sharedWith.unitName &&
                                  ` • ${sharedWith.unitName}`}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className='text-muted-foreground py-8 text-center text-sm'>
                    This file is not shared with anyone
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Main>
  )
}
