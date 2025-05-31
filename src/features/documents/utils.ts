import { z } from 'zod'
import { filterItemSchema, sortingItemSchema } from '@/lib/parsers'

export const documentsSearchParamsCache = z.object({
  filters: z.array(filterItemSchema).default([]),
  sort: z.array(sortingItemSchema).default([{ id: 'createdAt', desc: true }]),
})
