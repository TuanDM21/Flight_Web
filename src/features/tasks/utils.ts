import { z } from 'zod'
import { Option } from '@/types/data-table'
import { VariantProps } from 'class-variance-authority'
import { Ban, CheckCircle, CircleEllipsis, Clock } from 'lucide-react'
import { filterItemSchema, sortingItemSchema } from '@/lib/parsers'
import { badgeVariants } from '@/components/ui/badge'
import { TaskAssignmentStatus } from '@/features/tasks/types'

export const taskSearchParamsCache = z.object({
  filters: z.array(filterItemSchema).default([]),
  sort: z.array(sortingItemSchema).default([{ id: 'createdAt', desc: true }]),
})

export const taskAssignmentStatusLabels: Record<TaskAssignmentStatus, string> =
  {
    ASSIGNED: 'Assigned',
    IN_PROGRESS: 'In Progress',
    SUBMITTED: 'Submitted',
    REVIEWING: 'Reviewing',
    REJECTED: 'Rejected',
    COMPLETED: 'Completed',
    LATE_COMPLETED: 'Late Completed',
    REOPENED: 'Reopened',
    CANCELLED: 'Cancelled',
  }

export const taskAssignmentStatusVariants: Record<
  TaskAssignmentStatus,
  NonNullable<VariantProps<typeof badgeVariants>['variant']>
> = {
  ASSIGNED: 'default',
  IN_PROGRESS: 'in-progress',
  SUBMITTED: 'secondary',
  REVIEWING: 'secondary',
  REJECTED: 'destructive',
  COMPLETED: 'completed',
  LATE_COMPLETED: 'destructive',
  REOPENED: 'outline',
  CANCELLED: 'cancelled',
}

export const taskAssignmentsStatusIcons: Record<
  TaskAssignmentStatus,
  React.ElementType
> = {
  ASSIGNED: CircleEllipsis,
  IN_PROGRESS: Clock,
  SUBMITTED: CheckCircle,
  REVIEWING: CircleEllipsis,
  REJECTED: Ban,
  COMPLETED: CheckCircle,
  LATE_COMPLETED: Clock,
  REOPENED: CircleEllipsis,
  CANCELLED: Ban,
}

export const taskStatusOptions: Option[] = Object.entries(
  taskAssignmentStatusLabels
).map(([value, label]) => ({
  value,
  label,
  variant: taskAssignmentStatusVariants[value as TaskAssignmentStatus],
  icon: taskAssignmentsStatusIcons[value as TaskAssignmentStatus] as React.FC<
    React.SVGProps<SVGSVGElement>
  >,
}))
