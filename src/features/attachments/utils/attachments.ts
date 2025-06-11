import { z } from 'zod'
import { filterItemSchema, sortingItemSchema } from '@/lib/parsers'

export const attachmentSearchParamsCache = z.object({
  filters: z.array(filterItemSchema).default([]),
  sort: z.array(sortingItemSchema).default([{ id: 'createdAt', desc: true }]),
})

export const sharedAttachmentSearchParamsCache = z.object({
  filters: z.array(filterItemSchema).default([]),
  sort: z.array(sortingItemSchema).default([{ id: 'sharedAt', desc: true }]),
})

export const getBadgeClasses = (count: number) => {
  const baseClasses =
    'inline-flex h-7 min-w-[56px] items-center justify-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all duration-200'

  if (count === 0) {
    return `${baseClasses} bg-slate-100 text-slate-500 border border-slate-200`
  }

  return `${baseClasses} bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 hover:shadow-sm cursor-pointer`
}

export const getTooltipText = (count: number) => {
  if (count === 0) return 'Not shared with anyone'
  if (count === 1) return 'Shared with 1 person'
  return `Shared with ${count} people`
}

export const getIconSize = (count: number) => {
  if (count === 0) return 'h-3 w-3 opacity-60'
  return 'h-3.5 w-3.5'
}
