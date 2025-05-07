import { Option } from '@/types/data-table'
import { TaskAssignmentStatus } from '@/types/task'
import { VariantProps } from 'class-variance-authority'
import { CheckCircle, Text, XCircle } from 'lucide-react'
import { badgeVariants } from '@/components/ui/badge'

export const taskStatusLabels: Record<TaskAssignmentStatus, string> = {
  0: 'Not started',
  1: 'In progress',
  2: 'Completed',
}

export const taskStatusVariants: Record<
  TaskAssignmentStatus,
  NonNullable<VariantProps<typeof badgeVariants>['variant']>
> = {
  0: 'not-started',
  1: 'in-progress',
  2: 'completed',
}

export const taskStatusIcons: Record<TaskAssignmentStatus, React.ElementType> =
  {
    0: XCircle,
    1: Text,
    2: CheckCircle,
  }

export const taskStatusOptions: Option[] = [
  { label: 'Not Started', value: '0', icon: XCircle },
  { label: 'In Progress', value: '1', icon: Text },
  { label: 'Completed', value: '2', icon: CheckCircle },
]
