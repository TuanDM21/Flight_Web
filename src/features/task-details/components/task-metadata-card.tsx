import { format } from 'date-fns'
import { dateFormatPatterns } from '@/config/date'
import { Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Task } from '@/features/tasks/types'

interface AssignmentsInfo {
  count: number
  completed: number
  statuses: string[]
}

interface TaskMetadataCardProps {
  task: Task
  assignmentsInfo: AssignmentsInfo
}

export function TaskMetadataCard({
  task,
  assignmentsInfo,
}: TaskMetadataCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center space-x-2'>
          <Calendar className='h-5 w-5' />
          <span>Thông tin chi tiết</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div>
            <h3 className='text-muted-foreground mb-1 text-sm font-medium'>
              Cập nhật lần cuối
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
              Phân công
            </h3>
            {assignmentsInfo.count > 0 ? (
              <div className='space-y-1'>
                <p className='text-sm'>
                  {assignmentsInfo.count} phân công •{' '}
                  {assignmentsInfo.completed} đã hoàn thành
                </p>
              </div>
            ) : (
              <p className='text-sm'>Chưa có phân công</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
