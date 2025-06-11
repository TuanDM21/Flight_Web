import * as React from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { MyAttachmentsRoute } from '@/routes/_authenticated/attachments'
import { parseAsString, useQueryState } from 'nuqs'
import { getValidFilters } from '@/lib/data-table'
import { filterColumns } from '@/lib/filter-columns'
import { sortColumns } from '@/lib/sort-columns'
import { AttachmentFilters, AttachmentItem } from '../types'
import { attachmentSearchParamsCache } from '../utils/attachments'
import { myAttachmentsQueryOptions } from './use-my-attachments'

export function useAttachmentsSearchFilter() {
  const searchParams = MyAttachmentsRoute.useSearch()
  // Data fetching
  const { data: attachmentList } = useSuspenseQuery(myAttachmentsQueryOptions())

  // Query state management
  const [queryFilter, setQueryFilter] = useQueryState(
    'q',
    parseAsString.withDefault('')
  )

  // Parse search params
  const search = attachmentSearchParamsCache.parse(searchParams)
  const attachments = attachmentList.data ?? []

  const validFilters = getValidFilters(search.filters as any[])
  const isFiltering = Boolean(queryFilter) || validFilters.length > 0

  const filteredData = React.useMemo(() => {
    // Text search filter
    let filteredAttachments = attachments
    if (queryFilter) {
      const searchTerm = String(queryFilter).toLowerCase()
      filteredAttachments = attachments.filter((attachment) => {
        // Search in multiple fields - adjust as needed for your data structure
        const fileName = (attachment.fileName || '').toLowerCase()
        const uploadedBy = (attachment.uploadedBy?.name ?? '')
          ?.toString()
          .toLowerCase()

        return fileName.includes(searchTerm) || uploadedBy.includes(searchTerm)
      })
    }

    // Apply column filters using filterColumns
    if (validFilters.length > 0) {
      const filterFn = filterColumns<AttachmentFilters>({
        filters: validFilters,
        joinOperator: 'or',
      })

      if (filterFn) {
        filteredAttachments = filteredAttachments.filter(filterFn)
      }
    }

    // Apply sorting using sortColumns
    if (search.sort.length > 0) {
      filteredAttachments = sortColumns<AttachmentItem>(
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
