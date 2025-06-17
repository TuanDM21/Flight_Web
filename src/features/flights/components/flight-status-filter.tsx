import { Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

type FlightStatus = 'all' | 'scheduled' | 'departed' | 'arrived' | 'delayed'

interface FlightStatusFilterProps {
  value?: FlightStatus
  onValueChange?: (value: FlightStatus) => void
}

const statusConfig = {
  all: {
    label: 'Tất cả',
    icon: null,
    variant: 'outline' as const,
  },
  scheduled: {
    label: 'Đã lên lịch',
    icon: Clock,
    variant: 'secondary' as const,
  },
  departed: {
    label: 'Đã khởi hành',
    icon: CheckCircle,
    variant: 'default' as const,
  },
  arrived: {
    label: 'Đã đến',
    icon: CheckCircle,
    variant: 'completed' as const,
  },
  delayed: {
    label: 'Trễ chuyến',
    icon: AlertTriangle,
    variant: 'destructive' as const,
  },
}

export function FlightStatusFilter({
  value = 'all',
  onValueChange,
}: FlightStatusFilterProps) {
  const handleValueChange = (newValue: string) => {
    if (newValue && Object.keys(statusConfig).includes(newValue)) {
      onValueChange?.(newValue as FlightStatus)
    }
  }

  return (
    <div className='flex w-fit items-center gap-2 rounded-lg border pl-4'>
      <div className='flex items-center gap-2'>
        <label className='text-muted-foreground text-xs font-medium'>
          Trạng thái
        </label>
        <div className='bg-border h-8 w-px' />
      </div>
      <ToggleGroup
        type='single'
        value={value}
        onValueChange={handleValueChange}
        className='h-9 justify-start'
      >
        {Object.entries(statusConfig).map(([key, config]) => {
          const Icon = config.icon
          return (
            <ToggleGroupItem
              key={key}
              value={key}
              aria-label={config.label}
              className='flex items-center gap-2'
            >
              {Icon && <Icon className='h-3 w-3' />}
              <span className='hidden sm:inline'>{config.label}</span>
            </ToggleGroupItem>
          )
        })}
      </ToggleGroup>
    </div>
  )
}
