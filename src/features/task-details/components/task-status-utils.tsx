import React from 'react'
import {
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Ban,
  CircleEllipsis,
} from 'lucide-react'

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'ASSIGNED':
      return <Clock className='h-4 w-4' />
    case 'IN_PROGRESS':
      return <AlertCircle className='h-4 w-4' />
    case 'SUBMITTED':
      return <CheckCircle className='h-4 w-4' />
    case 'REVIEWING':
      return <Eye className='h-4 w-4' />
    case 'COMPLETED':
      return <CheckCircle2 className='h-4 w-4' />
    case 'LATE_COMPLETED':
      return <CheckCircle2 className='h-4 w-4' />
    case 'REJECTED':
      return <XCircle className='h-4 w-4' />
    case 'REOPENED':
      return <RotateCcw className='h-4 w-4' />
    case 'CANCELLED':
      return <Ban className='h-4 w-4' />
    case 'NEW':
      return <CircleEllipsis className='h-4 w-4' />
    case 'UNDER_REVIEW':
      return <Eye className='h-4 w-4' />
    case 'PARTIALLY_COMPLETED':
      return <CheckCircle className='h-4 w-4' />
    default:
      return <Clock className='h-4 w-4' />
  }
}

export const getStatusVariant = (status: string) => {
  const statusVariants: Record<string, any> = {
    ASSIGNED: 'default',
    IN_PROGRESS: 'secondary',
    SUBMITTED: 'secondary',
    REVIEWING: 'secondary',
    REJECTED: 'destructive',
    COMPLETED: 'default',
    LATE_COMPLETED: 'destructive',
    REOPENED: 'outline',
    CANCELLED: 'destructive',
    NEW: 'outline',
    UNDER_REVIEW: 'secondary',
    PARTIALLY_COMPLETED: 'secondary',
  }
  return statusVariants[status] || 'secondary'
}
