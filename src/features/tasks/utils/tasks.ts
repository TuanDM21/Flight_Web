import { z } from 'zod'
import { Option } from '@/types/data-table'
import { Ban, CheckCircle, CircleEllipsis, Clock } from 'lucide-react'
import { filterItemSchema, sortingItemSchema } from '@/lib/parsers'
import { TaskAssignmentStatus, TaskStatus } from '@/features/tasks/types'

export const taskSearchParamsCache = z.object({
  filters: z.array(filterItemSchema).default([]),
  sort: z.array(sortingItemSchema).default([{ id: 'createdAt', desc: true }]),
})

export const taskStatusStyles: Record<TaskStatus, string> = {
  NEW: 'bg-slate-100 text-slate-800 border-slate-200',
  ASSIGNED: 'bg-gray-200 text-gray-800 border-gray-300',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200',
  UNDER_REVIEW: 'bg-purple-100 text-purple-800 border-purple-200',
  PARTIALLY_COMPLETED: 'bg-amber-100 text-amber-800 border-amber-200',
  COMPLETED: 'bg-green-100 text-green-800 border-green-200',
  LATE_COMPLETED: 'bg-orange-100 text-orange-800 border-orange-200',
  CANCELLED: 'bg-gray-100 text-gray-600 border-gray-200',
}

export const taskStatusLabels: Record<TaskStatus, string> = {
  NEW: 'Mới',
  ASSIGNED: 'Đã giao',
  IN_PROGRESS: 'Đang thực hiện',
  UNDER_REVIEW: 'Đang xem xét',
  PARTIALLY_COMPLETED: 'Hoàn thành một phần',
  COMPLETED: 'Hoàn thành',
  LATE_COMPLETED: 'Hoàn thành muộn',
  CANCELLED: 'Đã hủy',
}

export const taskStatusIcons: Record<TaskStatus, React.ElementType> = {
  NEW: CircleEllipsis,
  ASSIGNED: CircleEllipsis,
  IN_PROGRESS: Clock,
  UNDER_REVIEW: CircleEllipsis,
  PARTIALLY_COMPLETED: CheckCircle,
  COMPLETED: CheckCircle,
  LATE_COMPLETED: Clock,
  CANCELLED: Ban,
}

export const allTaskAssignmentStatusLabels: Record<
  TaskAssignmentStatus,
  string
> = {
  ASSIGNED: 'Đã giao',
  IN_PROGRESS: 'Đang thực hiện',
  SUBMITTED: 'Đã nộp',
  REVIEWING: 'Đang xem xét',
  REJECTED: 'Đã từ chối',
  COMPLETED: 'Hoàn thành',
  LATE_COMPLETED: 'Hoàn thành muộn',
  REOPENED: 'Mở lại',
  CANCELLED: 'Đã hủy',
}

export const assigneeTaskAssignmentStatusLabels: Partial<
  Record<TaskAssignmentStatus, string>
> = {
  IN_PROGRESS: 'Đang thực hiện',
  SUBMITTED: 'Đã nộp',
}

export const ownerTaskAssignmentStatusLabels: Partial<
  Record<TaskAssignmentStatus, string>
> = {
  REVIEWING: 'Đang xem xét',
  REJECTED: 'Đã từ chối',
  COMPLETED: 'Hoàn thành',
  LATE_COMPLETED: 'Hoàn thành muộn',
  REOPENED: 'Mở lại',
  CANCELLED: 'Đã hủy',
}

export const taskAssignmentsStatusStyles: Record<TaskAssignmentStatus, string> =
  {
    ASSIGNED: 'bg-gray-200 text-gray-800 border-gray-300',
    IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200',
    SUBMITTED: 'bg-gray-300 text-gray-900 border-gray-400',
    REVIEWING: 'bg-purple-100 text-purple-800 border-purple-200',
    REJECTED: 'bg-red-100 text-red-800 border-red-200',
    COMPLETED: 'bg-green-100 text-green-800 border-green-200',
    LATE_COMPLETED: 'bg-orange-100 text-orange-800 border-orange-200',
    REOPENED: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    CANCELLED: 'bg-gray-100 text-gray-600 border-gray-200',
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
  allTaskAssignmentStatusLabels
).map(([value, label]) => ({
  value,
  label,
  icon: taskAssignmentsStatusIcons[value as TaskAssignmentStatus] as React.FC<
    React.SVGProps<SVGSVGElement>
  >,
}))
