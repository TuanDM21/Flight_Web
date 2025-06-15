import { format } from 'date-fns'
import { dateFormatPatterns } from '@/config/date'
import {
  Building,
  Calendar,
  CheckCircle,
  Clock,
  Mail,
  Users,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TaskAssignment } from '@/features/tasks/types'
import {
  assigneeTaskAssignmentStatusLabels,
  ownerTaskAssignmentStatusLabels,
  taskAssignmentsStatusIcons,
  taskAssignmentStatusVariants,
} from '@/features/tasks/utils/tasks'

interface TaskAssignmentsCardProps {
  assignments: TaskAssignment[]
  isTaskOwner: boolean
}

interface TaskAssignmentItemProps {
  assignment: TaskAssignment
  index: number

  isTaskOwner: boolean
}

function TaskAssignmentItem({
  assignment,
  index,
  isTaskOwner,
}: TaskAssignmentItemProps) {
  const taskAssignmentStatusLabels = isTaskOwner
    ? ownerTaskAssignmentStatusLabels
    : assigneeTaskAssignmentStatusLabels
  return (
    <div
      key={assignment.assignmentId || index}
      className='hover:bg-muted/50 rounded-lg border p-3 transition-colors sm:p-4'
    >
      <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
        <div className='flex min-w-0 flex-1 items-start space-x-3'>
          <Avatar className='h-8 w-8 shrink-0 sm:h-10 sm:w-10'>
            <AvatarFallback className='text-xs sm:text-sm'>
              {assignment.recipientUser?.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className='min-w-0 flex-1'>
            <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
              <p className='truncate text-sm font-medium'>
                {assignment.recipientUser?.name || 'Unknown User'}
              </p>
              {assignment.status && (
                <Badge
                  variant={taskAssignmentStatusVariants[assignment.status]}
                  className='w-fit shrink-0 text-xs'
                >
                  {(() => {
                    const Icon = taskAssignmentsStatusIcons[assignment.status]
                    return <Icon className='h-3 w-3' />
                  })()}
                  <span className='ml-1'>
                    {taskAssignmentStatusLabels[assignment.status]}
                  </span>
                </Badge>
              )}
            </div>
            <div className='text-muted-foreground mt-2 grid grid-cols-1 gap-1.5 text-xs sm:grid-cols-2'>
              {assignment.recipientUser?.email && (
                <div className='flex items-center space-x-2'>
                  <Mail className='h-3 w-3 shrink-0' />
                  <span className='truncate'>
                    {assignment.recipientUser.email}
                  </span>
                </div>
              )}
              {assignment.recipientUser?.teamName && (
                <div className='flex items-center space-x-2'>
                  <Building className='h-3 w-3 shrink-0' />
                  <span className='truncate'>
                    {assignment.recipientUser.teamName}
                  </span>
                </div>
              )}
              {assignment.assignedAt && (
                <div className='flex items-center space-x-2'>
                  <Clock className='h-3 w-3 shrink-0' />
                  <span className='truncate'>
                    <span className='hidden sm:inline'>Assigned on </span>
                    <span className='sm:hidden'>Assigned: </span>
                    {format(
                      new Date(assignment.assignedAt),
                      dateFormatPatterns.fullDateTime
                    )}
                  </span>
                </div>
              )}
              {assignment.dueAt && (
                <div className='flex items-center space-x-2'>
                  <Calendar className='h-3 w-3 shrink-0' />
                  <span className='truncate'>
                    <span className='hidden sm:inline'>Due by </span>
                    <span className='sm:hidden'>Due: </span>
                    {format(
                      new Date(assignment.dueAt),
                      dateFormatPatterns.fullDateTime
                    )}
                  </span>
                </div>
              )}
              {assignment.completedAt && (
                <div className='flex items-center space-x-2 sm:col-span-2'>
                  <CheckCircle className='h-3 w-3 shrink-0' />
                  <span className='truncate'>
                    <span className='hidden sm:inline'>Completed on </span>
                    <span className='sm:hidden'>Done: </span>
                    {format(
                      new Date(assignment.completedAt),
                      dateFormatPatterns.fullDateTime
                    )}
                  </span>
                </div>
              )}
            </div>
            {assignment.note && (
              <div className='bg-muted/50 mt-3 rounded-md p-2.5'>
                <p className='text-xs leading-relaxed break-words'>
                  {assignment.note}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function TaskAssignmentsCard({
  assignments,
  isTaskOwner,
}: TaskAssignmentsCardProps) {
  if (!assignments || assignments.length === 0) {
    return (
      <Card>
        <CardContent className='text-muted-foreground py-8 text-center'>
          No assignments found.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className='pb-4'>
        <CardTitle className='flex items-center space-x-2 text-lg'>
          <Users className='h-5 w-5 shrink-0' />
          <span className='truncate'>Assignments ({assignments.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className='px-3 sm:px-6'>
        <ScrollArea className='max-h-96'>
          <div className='grid grid-cols-1 gap-3 pr-4 sm:gap-4 lg:grid-cols-2'>
            {assignments.map((assignment, index) => (
              <TaskAssignmentItem
                key={assignment.assignmentId || index}
                assignment={assignment}
                index={index}
                isTaskOwner={isTaskOwner}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
