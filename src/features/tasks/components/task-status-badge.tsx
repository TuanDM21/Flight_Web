import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { TaskStatus } from '@/features/tasks/types'
import {
  taskStatusIcons,
  taskStatusLabels,
  taskStatusStyles,
} from '@/features/tasks/utils/tasks'

interface TaskStatusBadgeProps {
  status: TaskStatus
  showIcon?: boolean
  className?: string
  size?: 'sm' | 'md'
}

export function TaskStatusBadge({
  status,
  showIcon = true,
  className,
  size = 'md',
}: TaskStatusBadgeProps) {
  const label = taskStatusLabels[status]
  const Icon = taskStatusIcons[status]
  const statusStyle = taskStatusStyles[status]

  return (
    <Badge
      className={cn(
        'border font-medium',
        statusStyle,
        size === 'sm' && 'h-5 px-1.5 py-0.5 text-[10px]',
        size === 'md' && 'h-6 px-2 py-0.5 text-xs',
        className
      )}
    >
      {showIcon && (
        <Icon
          className={cn('shrink-0', size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3')}
        />
      )}
      <span className='truncate'>{label}</span>
    </Badge>
  )
}
