import React from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { TaskDetailRoute } from '@/routes/_authenticated/tasks/$task-id'
import { downloadFileFromUrl } from '@/utils/file'
import { useFileIconType } from '@/hooks/use-file-icon-type'
import { Card, CardContent } from '@/components/ui/card'
import { AppConfirmDialog } from '@/components/app-confirm-dialog'
import { TaskAssignmentsCard } from '@/features/task-details/components/task-assignments-card'
import { TaskDetailHeader } from '@/features/task-details/components/task-detail-header'
import { getAssignmentsInfo } from '@/features/task-details/components/task-detail-utils'
import { TaskDocumentsCard } from '@/features/task-details/components/task-documents-card'
import { TaskInformationCard } from '@/features/task-details/components/task-information-card'
import { TaskMetadataCard } from '@/features/task-details/components/task-metadata-card'
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

  const { getFileIcon } = useFileIconType()

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

  const assignmentsInfo = getAssignmentsInfo(task)

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
        <TaskDetailHeader taskId={task.id ?? 0} onDelete={handleDelete} />

        <div className='grid gap-6'>
          <TaskInformationCard task={task} />

          <TaskAssignmentsCard assignments={task.assignments || []} />
          <TaskDocumentsCard
            documents={task.documents || []}
            onDownloadAttachment={handleDownloadAttachment}
            getFileIcon={getFileIcon}
          />

          <TaskMetadataCard task={task} assignmentsInfo={assignmentsInfo} />
        </div>
      </div>
    </>
  )
}
