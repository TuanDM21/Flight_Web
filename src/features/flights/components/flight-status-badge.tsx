import {
  AlertTriangle,
  Ban,
  CheckCircle,
  Clock,
  Navigation,
  Plane,
  PlaneLanding,
  Timer,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { FLIGHT_STATUS, flightStatusLabels } from '../constants'
import { FlightStatus } from '../types'

interface FlightStatusProps {
  status: FlightStatus
  showIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const statusIcons: Record<FlightStatus, React.ComponentType<any>> = {
  [FLIGHT_STATUS.SCHEDULED]: Clock,
  [FLIGHT_STATUS.BOARDING]: Timer,
  [FLIGHT_STATUS.GATE_CLOSED]: Ban,
  [FLIGHT_STATUS.DELAYED]: AlertTriangle,
  [FLIGHT_STATUS.IN_AIR]: Plane,
  [FLIGHT_STATUS.LANDED]: PlaneLanding,
  [FLIGHT_STATUS.CANCELLED]: Ban,
  [FLIGHT_STATUS.DIVERTED]: Navigation,
  [FLIGHT_STATUS.ARRIVED]: CheckCircle,
}

const statusStyles: Record<FlightStatus, string> = {
  [FLIGHT_STATUS.SCHEDULED]:
    'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
  [FLIGHT_STATUS.BOARDING]:
    'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200',
  [FLIGHT_STATUS.GATE_CLOSED]:
    'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200',
  [FLIGHT_STATUS.DELAYED]:
    'bg-red-100 text-red-700 border-red-200 hover:bg-red-200',
  [FLIGHT_STATUS.IN_AIR]:
    'bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200',
  [FLIGHT_STATUS.LANDED]:
    'bg-green-100 text-green-700 border-green-200 hover:bg-green-200',
  [FLIGHT_STATUS.CANCELLED]:
    'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200',
  [FLIGHT_STATUS.DIVERTED]:
    'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200',
  [FLIGHT_STATUS.ARRIVED]:
    'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200',
}

const sizeVariants = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-2.5 py-1.5 text-sm',
  lg: 'px-3 py-2 text-base',
}

const iconSizeVariants = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
}

export function FlightStatusBadge({
  status,
  showIcon = true,
  size = 'md',
  className,
}: FlightStatusProps) {
  const label = flightStatusLabels[status]
  const customStyle = statusStyles[status]
  const IconComponent = statusIcons[status]

  return (
    <Badge
      className={cn(
        'border font-medium transition-colors',
        customStyle,
        sizeVariants[size],
        className
      )}
    >
      {showIcon && IconComponent && (
        <IconComponent
          className={cn(iconSizeVariants[size], 'mr-1 flex-shrink-0')}
        />
      )}
      <span className='truncate'>{label}</span>
    </Badge>
  )
}
