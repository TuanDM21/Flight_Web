import { Option } from '@/types/data-table'
import { TaskAssignmentStatus } from '@/types/task'
import { VariantProps } from 'class-variance-authority'
import { Ban, CheckCircle, CircleEllipsis, Clock } from 'lucide-react'
import { badgeVariants } from '@/components/ui/badge'

export const taskStatusLabels: Record<TaskAssignmentStatus, string> = {
  0: 'Pending',
  1: 'In progress',
  2: 'Completed',
  3: 'Cancelled',
}

export const taskStatusVariants: Record<
  TaskAssignmentStatus,
  NonNullable<VariantProps<typeof badgeVariants>['variant']>
> = {
  0: 'pending',
  1: 'in-progress',
  2: 'completed',
  3: 'cancelled',
}

export const taskStatusIcons: Record<TaskAssignmentStatus, React.ElementType> =
  {
    0: Clock,
    1: CircleEllipsis,
    2: CheckCircle,
    3: Ban,
  }

export const taskStatusOptions: Option[] = [
  { label: 'Not Started', value: '0', icon: Clock },
  { label: 'In Progress', value: '1', icon: CircleEllipsis },
  { label: 'Completed', value: '2', icon: CheckCircle },
]
