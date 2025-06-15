import React from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { TaskDetailRoute } from '@/routes/_authenticated/tasks/$task-id'
import { downloadFileFromUrl } from '@/utils/file'
import { useAuth } from '@/context/auth-context'
import { useFileIconType } from '@/hooks/use-file-icon-type'
import { Card, CardContent } from '@/components/ui/card'
import { TaskAssignmentsCard } from '@/features/task-details/components/task-assignments-card'
import { TaskDetailHeader } from '@/features/task-details/components/task-detail-header'
import { getAssignmentsInfo } from '@/features/task-details/components/task-detail-utils'
import { TaskDocumentsCard } from '@/features/task-details/components/task-documents-card'
import { TaskInformationCard } from '@/features/task-details/components/task-information-card'
import { TaskMetadataCard } from '@/features/task-details/components/task-metadata-card'
import { getTaskDetailQueryOptions } from './hooks/use-task-detail'
import { TaskDocumentAttachment } from './types'

export default function TaskDetailPage() {
  const taskId = TaskDetailRoute.useParams()['task-id']
  const { user } = useAuth()

  const { data: taskDetail } = useSuspenseQuery(
    getTaskDetailQueryOptions(Number(taskId))
  )
  const task = taskDetail?.data

  const isTaskOwner = user?.id === task?.createdByUser?.id

  const { getFileIcon } = useFileIconType()

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
            <p className='text-muted-foreground text-center'>
              Không tìm thấy nhiệm vụ
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='px-4 py-2'>
      <TaskDetailHeader task={task} />

      <div className='grid gap-6'>
        <TaskInformationCard task={task} />

        <TaskAssignmentsCard
          assignments={task.assignments || []}
          isTaskOwner={isTaskOwner}
        />
        <TaskDocumentsCard
          documents={task.documents || []}
          onDownloadAttachment={handleDownloadAttachment}
          getFileIcon={getFileIcon}
        />

        <TaskMetadataCard task={task} assignmentsInfo={assignmentsInfo} />
      </div>
    </div>
  )
}
