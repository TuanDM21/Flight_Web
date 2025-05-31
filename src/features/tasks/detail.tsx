import React from 'react'
import { format } from 'date-fns'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { dateFormatPatterns } from '@/config/date'
import { TaskDetailRoute } from '@/routes/_authenticated/tasks/$task-id'
import {
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  FileText,
  Paperclip,
  Trash2,
  Users,
  Building,
  Mail,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Ban,
  Eye,
  Download,
  CircleEllipsis,
} from 'lucide-react'
import { formatFileSize } from '@/lib/format'
import { downloadFileFromUrl } from '@/utils/file'
import { useFileIconType } from '@/hooks/use-file-icon-type'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { AppConfirmDialog } from '@/components/app-confirm-dialog'
import { DataTableActionBarAction } from '@/components/data-table/data-table-action-bar'
import DeleteTaskConfirmDialog from './components/delete-task-confirm-dialog'
import { getTaskDetailQueryOptions } from './hooks/use-view-task-detail'
import { TaskDocumentAttachment } from './types'

export default function TaskDetailPage() {
  const taskId = TaskDetailRoute.useParams()['task-id']
  const deleteDialogInstance = AppConfirmDialog.useDialog()
  const navigate = useNavigate()

  const { data: taskDetail } = useSuspenseQuery(
    getTaskDetailQueryOptions(Number(taskId))
  )
  const task = taskDetail?.data

  const { getFileType, getFileIcon } = useFileIconType()

  const handleDelete = async () => {
    deleteDialogInstance.open()
  }

  const handleDeleteSuccess = () => {
    navigate({ to: '/tasks' })
  }

  const handleDownloadAttachment = React.useCallback(
    async (attachment: TaskDocumentAttachment) => {
      if (attachment.filePath) {
        await downloadFileFromUrl({
          url: attachment.filePath,
          filename: attachment.fileName || 'download',
        })
      }
    },
    []
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ASSIGNED':
        return <Clock className='h-4 w-4' />
      case 'IN_PROGRESS':
        return <AlertCircle className='h-4 w-4' />
      case 'SUBMITTED':
        return <CheckCircle className='h-4 w-4' />
      case 'REVIEWING':
        return <Eye className='h-4 w-4' />
      case 'COMPLETED':
        return <CheckCircle2 className='h-4 w-4' />
      case 'LATE_COMPLETED':
        return <CheckCircle2 className='h-4 w-4' />
      case 'REJECTED':
        return <XCircle className='h-4 w-4' />
      case 'REOPENED':
        return <RotateCcw className='h-4 w-4' />
      case 'CANCELLED':
        return <Ban className='h-4 w-4' />
      case 'NEW':
        return <CircleEllipsis className='h-4 w-4' />
      case 'UNDER_REVIEW':
        return <Eye className='h-4 w-4' />
      case 'PARTIALLY_COMPLETED':
        return <CheckCircle className='h-4 w-4' />
      default:
        return <Clock className='h-4 w-4' />
    }
  }

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      ASSIGNED: 'Assigned',
      IN_PROGRESS: 'In Progress',
      SUBMITTED: 'Submitted',
      REVIEWING: 'Reviewing',
      REJECTED: 'Rejected',
      COMPLETED: 'Completed',
      LATE_COMPLETED: 'Late Completed',
      REOPENED: 'Reopened',
      CANCELLED: 'Cancelled',
      NEW: 'New',
      UNDER_REVIEW: 'Under Review',
      PARTIALLY_COMPLETED: 'Partially Completed',
    }
    return statusLabels[status] || status
  }

  const getStatusVariant = (status: string) => {
    const statusVariants: Record<string, any> = {
      ASSIGNED: 'default',
      IN_PROGRESS: 'secondary',
      SUBMITTED: 'secondary',
      REVIEWING: 'secondary',
      REJECTED: 'destructive',
      COMPLETED: 'default',
      LATE_COMPLETED: 'destructive',
      REOPENED: 'outline',
      CANCELLED: 'destructive',
      NEW: 'outline',
      UNDER_REVIEW: 'secondary',
      PARTIALLY_COMPLETED: 'secondary',
    }
    return statusVariants[status] || 'secondary'
  }

  const getAssignmentsInfo = () => {
    if (!task?.assignments || task.assignments.length === 0) {
      return { count: 0, completed: 0, statuses: [] }
    }

    const completed = task.assignments.filter(
      (assignment) =>
        assignment.status === 'COMPLETED' ||
        assignment.status === 'LATE_COMPLETED'
    ).length

    const statuses = [
      ...new Set(
        task.assignments
          .map((assignment) => assignment.status)
          .filter((status) => status !== undefined)
      ),
    ]

    return {
      count: task.assignments.length,
      completed,
      statuses,
    }
  }

  const getDocumentsInfo = () => {
    if (!task?.documents || task.documents.length === 0) {
      return { count: 0, totalAttachments: 0, totalSize: 0, types: [] }
    }

    const totalAttachments = task.documents.reduce(
      (sum, doc) => sum + (doc.attachments?.length || 0),
      0
    )

    const totalSize = task.documents.reduce(
      (sum, doc) =>
        sum +
        (doc.attachments?.reduce(
          (attachSum, att) => attachSum + (att.fileSize || 0),
          0
        ) || 0),
      0
    )

    const types = [
      ...new Set(
        task.documents.flatMap(
          (doc) =>
            doc.attachments?.map((att) => getFileType(att.fileName || '')) || []
        )
      ),
    ]

    return {
      count: task.documents.length,
      totalAttachments,
      totalSize,
      types,
    }
  }

  const assignmentsInfo = getAssignmentsInfo()
  const documentsInfo = getDocumentsInfo()

  if (!task) {
    return (
      <div className='px-4 py-2'>
        <Card>
          <CardContent className='pt-6'>
            <p className='text-muted-foreground text-center'>Task not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      {deleteDialogInstance.isOpen && (
        <DeleteTaskConfirmDialog
          taskId={Number(taskId)}
          dialog={deleteDialogInstance}
          onSuccess={handleDeleteSuccess}
        />
      )}

      <div className='px-4 py-2'>
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div>
              <h1 className='text-2xl font-bold'>Task #{task.id}</h1>
              {task.status && (
                <Badge variant={getStatusVariant(task.status)} className='mt-1'>
                  {getStatusIcon(task.status)}
                  <span className='ml-1'>{getStatusLabel(task.status)}</span>
                </Badge>
              )}
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            <Button variant='outline' asChild className='space-x-1'>
              <Link
                to='/tasks/$task-id/edit'
                params={{
                  'task-id': (task.id ?? '').toString(),
                }}
              >
                <Edit className='mr-2 h-4 w-4' />
                Edit
              </Link>
            </Button>
            <Button
              variant='destructive'
              className='space-x-1'
              onClick={handleDelete}
            >
              <Trash2 className='mr-2 h-4 w-4' />
              Delete
            </Button>
          </div>
        </div>

        <div className='grid gap-6'>
          {/* Task Information */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <FileText className='h-5 w-5' />
                <span>Task Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div>
                <h3 className='text-muted-foreground mb-2 text-sm font-medium'>
                  Content
                </h3>
                <div className='bg-muted/50 rounded-md p-4'>
                  <p className='text-sm whitespace-pre-wrap'>
                    {task.content || 'No content provided'}
                  </p>
                </div>
              </div>

              {task.instructions && (
                <>
                  <Separator />
                  <div>
                    <h3 className='text-muted-foreground mb-2 text-sm font-medium'>
                      Instructions
                    </h3>
                    <div className='bg-muted/50 rounded-md p-4'>
                      <p className='text-sm whitespace-pre-wrap'>
                        {task.instructions}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {task.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className='text-muted-foreground mb-2 text-sm font-medium'>
                      Notes
                    </h3>
                    <div className='bg-muted/50 rounded-md p-4'>
                      <p className='text-sm whitespace-pre-wrap'>
                        {task.notes}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Created by user */}
              {task.createdByUser && (
                <>
                  <Separator />
                  <div>
                    <h3 className='text-muted-foreground mb-2 text-sm font-medium'>
                      Created By
                    </h3>
                    <div className='flex items-center space-x-3'>
                      <Avatar className='h-8 w-8'>
                        <AvatarFallback>
                          {task.createdByUser.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='text-sm font-medium'>
                          {task.createdByUser.name}
                        </p>
                        <div className='text-muted-foreground flex items-center space-x-2 text-xs'>
                          <Mail className='h-3 w-3' />
                          <span>{task.createdByUser.email}</span>
                          {task.createdByUser.roleName && (
                            <>
                              <span>•</span>
                              <span>{task.createdByUser.roleName}</span>
                            </>
                          )}
                          {task.createdByUser.teamName && (
                            <>
                              <span>•</span>
                              <Building className='h-3 w-3' />
                              <span>{task.createdByUser.teamName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Assignments */}
          {task.assignments && task.assignments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <Users className='h-5 w-5' />
                  <span>Assignments ({task.assignments.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {task.assignments.map((assignment, index) => (
                    <div
                      key={assignment.assignmentId || index}
                      className='hover:bg-muted/50 rounded-lg border p-4 transition-colors'
                    >
                      <div className='flex items-start justify-between'>
                        <div className='flex items-start space-x-3'>
                          <Avatar className='h-8 w-8'>
                            <AvatarFallback>
                              {assignment.recipientUser?.name
                                ?.charAt(0)
                                .toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className='flex-1'>
                            <div className='flex items-center space-x-2'>
                              <p className='text-sm font-medium'>
                                {assignment.recipientUser?.name ||
                                  'Unknown User'}
                              </p>
                              {assignment.status && (
                                <Badge
                                  variant={getStatusVariant(assignment.status)}
                                  className='text-xs'
                                >
                                  {getStatusIcon(assignment.status)}
                                  <span className='ml-1'>
                                    {getStatusLabel(assignment.status)}
                                  </span>
                                </Badge>
                              )}
                            </div>
                            <div className='text-muted-foreground mt-1 space-y-1 text-xs'>
                              {assignment.recipientUser?.email && (
                                <div className='flex items-center space-x-1'>
                                  <Mail className='h-3 w-3' />
                                  <span>{assignment.recipientUser.email}</span>
                                </div>
                              )}
                              {assignment.recipientUser?.teamName && (
                                <div className='flex items-center space-x-1'>
                                  <Building className='h-3 w-3' />
                                  <span>
                                    {assignment.recipientUser.teamName}
                                  </span>
                                </div>
                              )}
                              {assignment.assignedAt && (
                                <div className='flex items-center space-x-1'>
                                  <Clock className='h-3 w-3' />
                                  <span>
                                    Assigned on{' '}
                                    {format(
                                      new Date(assignment.assignedAt),
                                      dateFormatPatterns.fullDateTime
                                    )}
                                  </span>
                                </div>
                              )}
                              {assignment.dueAt && (
                                <div className='flex items-center space-x-1'>
                                  <Calendar className='h-3 w-3' />
                                  <span>
                                    Due by{' '}
                                    {format(
                                      new Date(assignment.dueAt),
                                      dateFormatPatterns.fullDateTime
                                    )}
                                  </span>
                                </div>
                              )}
                              {assignment.completedAt && (
                                <div className='flex items-center space-x-1'>
                                  <CheckCircle className='h-3 w-3' />
                                  <span>
                                    Completed on{' '}
                                    {format(
                                      new Date(assignment.completedAt),
                                      dateFormatPatterns.fullDateTime
                                    )}
                                  </span>
                                </div>
                              )}
                            </div>
                            {assignment.note && (
                              <div className='bg-muted/50 mt-2 rounded-md p-2'>
                                <p className='text-xs'>{assignment.note}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          {task.documents && task.documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <Paperclip className='h-5 w-5' />
                  <span>Documents ({task.documents.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {task.documents.map((document, index) => (
                    <div
                      key={document.id || index}
                      className='hover:bg-muted/50 rounded-lg border p-4 transition-colors'
                    >
                      <div className='space-y-3'>
                        <div className='flex items-start justify-between'>
                          <div>
                            <div className='flex items-center space-x-2'>
                              <FileText className='h-4 w-4' />
                              <span className='text-sm font-medium'>
                                Document #{document.id}
                              </span>
                              {document.documentType && (
                                <Badge variant='outline' className='text-xs'>
                                  {document.documentType}
                                </Badge>
                              )}
                            </div>
                            <p className='text-muted-foreground mt-1 text-xs'>
                              Created on{' '}
                              {format(
                                new Date(document.createdAt || ''),
                                dateFormatPatterns.fullDateTime
                              )}
                            </p>
                          </div>
                        </div>

                        {document.content && (
                          <div className='bg-muted/50 rounded-md p-3'>
                            <p className='text-sm whitespace-pre-wrap'>
                              {document.content}
                            </p>
                          </div>
                        )}

                        {document.notes && (
                          <div className='bg-muted/50 rounded-md p-3'>
                            <p className='text-xs italic'>{document.notes}</p>
                          </div>
                        )}

                        {/* Document Attachments */}
                        {document.attachments &&
                          document.attachments.length > 0 && (
                            <div className='space-y-2'>
                              <h4 className='text-muted-foreground text-xs font-medium'>
                                Attachments ({document.attachments.length})
                              </h4>
                              <div className='space-y-2'>
                                {document.attachments.map(
                                  (attachment, attachIndex) => (
                                    <div
                                      key={attachment.id || attachIndex}
                                      className='hover:bg-muted/30 flex items-center justify-between rounded-md border p-2 transition-colors'
                                    >
                                      <div className='flex items-center space-x-2'>
                                        <div className='bg-primary/10 rounded-md p-1'>
                                          {getFileIcon(
                                            attachment.fileName || ''
                                          )}
                                        </div>
                                        <div>
                                          <p className='text-xs font-medium'>
                                            {attachment.fileName}
                                          </p>
                                          <div className='text-muted-foreground flex items-center space-x-2 text-xs'>
                                            <span>
                                              {formatFileSize(
                                                attachment.fileSize || 0
                                              )}
                                            </span>
                                            {attachment.uploadedBy && (
                                              <>
                                                <span>•</span>
                                                <span>
                                                  by{' '}
                                                  {attachment.uploadedBy.name}
                                                </span>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className='flex items-center gap-2'>
                                        {attachment.filePath && (
                                          <a
                                            href={attachment.filePath}
                                            target='_blank'
                                            rel='noopener noreferrer'
                                          >
                                            <DataTableActionBarAction
                                              size='icon'
                                              tooltip='View file'
                                              className='h-6 w-6'
                                            >
                                              <Eye className='h-3 w-3' />
                                            </DataTableActionBarAction>
                                          </a>
                                        )}
                                        <DataTableActionBarAction
                                          size='icon'
                                          tooltip='Download file'
                                          onClick={() =>
                                            handleDownloadAttachment(attachment)
                                          }
                                          className='h-6 w-6'
                                        >
                                          <Download className='h-3 w-3' />
                                        </DataTableActionBarAction>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <Calendar className='h-5 w-5' />
                <span>Metadata</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                  <h3 className='text-muted-foreground mb-1 text-sm font-medium'>
                    Created At
                  </h3>
                  <p className='text-sm'>
                    {format(
                      new Date(task.createdAt || ''),
                      dateFormatPatterns.fullDateTime
                    )}
                  </p>
                </div>
                <div>
                  <h3 className='text-muted-foreground mb-1 text-sm font-medium'>
                    Last Updated
                  </h3>
                  <p className='text-sm'>
                    {format(
                      new Date(task.updatedAt || ''),
                      dateFormatPatterns.fullDateTime
                    )}
                  </p>
                </div>
                <div>
                  <h3 className='text-muted-foreground mb-1 text-sm font-medium'>
                    Task ID
                  </h3>
                  <p className='font-mono text-sm'>#{task.id}</p>
                </div>
                <div>
                  <h3 className='text-muted-foreground mb-1 text-sm font-medium'>
                    Status
                  </h3>
                  {task.status ? (
                    <Badge variant={getStatusVariant(task.status)}>
                      {getStatusIcon(task.status)}
                      <span className='ml-1'>
                        {getStatusLabel(task.status)}
                      </span>
                    </Badge>
                  ) : (
                    <p className='text-sm'>No status</p>
                  )}
                </div>
                <div>
                  <h3 className='text-muted-foreground mb-1 text-sm font-medium'>
                    Assignments
                  </h3>
                  {assignmentsInfo.count > 0 ? (
                    <div className='space-y-1'>
                      <p className='text-sm'>
                        {assignmentsInfo.count} assignment(s) •{' '}
                        {assignmentsInfo.completed} completed
                      </p>
                      {assignmentsInfo.statuses.length > 0 && (
                        <div className='flex flex-wrap gap-1'>
                          {assignmentsInfo.statuses.map((status) => (
                            <Badge
                              key={status}
                              variant='outline'
                              className='text-xs'
                            >
                              {getStatusLabel(status)}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className='text-sm'>No assignments</p>
                  )}
                </div>
                <div>
                  <h3 className='text-muted-foreground mb-1 text-sm font-medium'>
                    Documents
                  </h3>
                  {documentsInfo.count > 0 ? (
                    <div className='space-y-1'>
                      <p className='text-sm'>
                        {documentsInfo.count} document(s) •{' '}
                        {documentsInfo.totalAttachments} attachment(s)
                      </p>
                      {documentsInfo.totalSize > 0 && (
                        <p className='text-muted-foreground text-xs'>
                          Total size: {formatFileSize(documentsInfo.totalSize)}
                        </p>
                      )}
                      {documentsInfo.types.length > 0 && (
                        <div className='flex flex-wrap gap-1'>
                          {documentsInfo.types.map((type) => (
                            <Badge
                              key={type}
                              variant='outline'
                              className='text-xs'
                            >
                              {type}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className='text-sm'>No documents</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
