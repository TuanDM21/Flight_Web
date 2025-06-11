import * as React from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { SharedWithMeAttachmentsRoute } from '@/routes/_authenticated/attachments/shared-with-me'
import { parseAsString, useQueryState } from 'nuqs'
import { getValidFilters } from '@/lib/data-table'
import { filterColumns } from '@/lib/filter-columns'
import { sortColumns } from '@/lib/sort-columns'
import { SharedWithMeAttachmentItem, SharedAttachmentFilters } from '../types'
import { sharedAttachmentSearchParamsCache } from '../utils/attachments'
import { sharedWithMeAttachmentsQueryOptions } from './use-shared-with-me-attachments'

export function useShareWithMeSearchFilter() {
  const searchParams = SharedWithMeAttachmentsRoute.useSearch()
  // Data fetching
  const { data: attachmentList } = useSuspenseQuery(
    sharedWithMeAttachmentsQueryOptions()
  )

  // Query state management
  const [queryFilter, setQueryFilter] = useQueryState(
    'q',
    parseAsString.withDefault('')
  )

  // Parse search params
  const search = sharedAttachmentSearchParamsCache.parse(searchParams)
  const attachments = attachmentList.data ?? []

  const validFilters = getValidFilters(search.filters as any[])
  const isFiltering = Boolean(queryFilter) || validFilters.length > 0

  const filteredData = React.useMemo(() => {
    // Text search filter
    let filteredAttachments = attachments
    if (queryFilter) {
      const searchTerm = String(queryFilter).toLowerCase()
      filteredAttachments = attachments.filter((attachment) => {
        // Search in multiple fields - adjusted for shared attachment structure
        const fileName = (attachment.fileName || '').toLowerCase()
        const sharedBy = (attachment.sharedBy?.name ?? '')
          ?.toString()
          .toLowerCase()

        return fileName.includes(searchTerm) || sharedBy.includes(searchTerm)
      })
    }

    // Apply column filters using filterColumns
    if (validFilters.length > 0) {
      const filterFn = filterColumns<SharedAttachmentFilters>({
        filters: validFilters,
        joinOperator: 'or',
      })

      if (filterFn) {
        filteredAttachments = filteredAttachments.filter(filterFn)
      }
    }

    // Apply sorting using sortColumns
    if (search.sort.length > 0) {
      filteredAttachments = sortColumns<SharedWithMeAttachmentItem>(
        filteredAttachments,
        search.sort as any[]
      )
    }

    return filteredAttachments
  }, [attachments, queryFilter, validFilters, search.sort])

  return {
    filteredData,
    isFiltering,
    validFilters,
    queryFilter,
    setQueryFilter,
  }
}
