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
          <span>Metadata</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
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
              Assignments
            </h3>
            {assignmentsInfo.count > 0 ? (
              <div className='space-y-1'>
                <p className='text-sm'>
                  {assignmentsInfo.count} assignment(s) •{' '}
                  {assignmentsInfo.completed} completed
                </p>
              </div>
            ) : (
              <p className='text-sm'>No assignments</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
