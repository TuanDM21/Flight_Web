import * as React from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { DocumentsRoute } from '@/routes/_authenticated/documents'
import { parseAsString, useQueryState } from 'nuqs'
import { getValidFilters } from '@/lib/data-table'
import { filterColumns } from '@/lib/filter-columns'
import { sortColumns } from '@/lib/sort-columns'
import { DocumentFilters, DocumentItem } from '../types'
import { documentsSearchParamsCache } from '../utils'
import { getDocumentListQueryOptions } from './use-documents'

export function useDocumentsSearchFilter() {
  const searchParams = DocumentsRoute.useSearch()
  // Data fetching
  const { data: documentList } = useSuspenseQuery(getDocumentListQueryOptions())

  // Query state management
  const [queryFilter, setQueryFilter] = useQueryState(
    'q',
    parseAsString.withDefault('')
  )

  // Parse search params
  const search = documentsSearchParamsCache.parse(searchParams)
  const documents = documentList.data ?? []

  const validFilters = getValidFilters(search.filters as any[])
  const isFiltering = Boolean(queryFilter) || validFilters.length > 0

  const filteredData = React.useMemo(() => {
    // Text search filter
    let filteredDocuments = documents
    if (queryFilter) {
      const searchTerm = String(queryFilter).toLowerCase()
      filteredDocuments = documents.filter((document) => {
        const content = (document.content || '').toLowerCase()
        const note = (document.notes || '').toLowerCase()
        const documentType = (document.documentType || '').toLowerCase()

        return (
          content.includes(searchTerm) ||
          note.includes(searchTerm) ||
          documentType.includes(searchTerm)
        )
      })
    }

    // Apply column filters using filterColumns
    if (validFilters.length > 0) {
      const filterFn = filterColumns<DocumentFilters>({
        filters: validFilters,
        joinOperator: 'or',
      })

      if (filterFn) {
        filteredDocuments = filteredDocuments.filter(filterFn)
      }
    }

    // Apply sorting using sortColumns
    if (search.sort.length > 0) {
      filteredDocuments = sortColumns<DocumentItem>(
        filteredDocuments,
        search.sort as any[]
      )
    }

    return filteredDocuments
  }, [documents, queryFilter, validFilters, search.sort])

  return {
    filteredData,
    isFiltering,
    validFilters,
    queryFilter,
    setQueryFilter,
  }
}
