import React from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { DocumentListRoute } from '@/routes/_authenticated/documents'
import { parseAsString, useQueryState } from 'nuqs'
import { getValidFilters } from '@/lib/data-table'
import { filterColumns } from '@/lib/filter-columns'
import { sortColumns } from '@/lib/sort-columns'
import { useDataTable } from '@/hooks/use-data-table'
import { Input } from '@/components/ui/input'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableAdvancedToolbar } from '@/components/data-table/data-table-advanced-toolbar'
import { DataTableFilterMenu } from '@/components/data-table/data-table-filter-menu'
import { DataTableSortList } from '@/components/data-table/data-table-sort-list'
import { Search } from '@/components/search'
import { DocumentsPrimaryButtons } from './components/documents-primary-buttons'
import { DocumentsTableActionBar } from './components/documents-table-action-bar'
import { useDocumentColumns } from './hooks/use-document-columns'
import { getDocumentListQueryOptions } from './hooks/use-documents'
import type { DocumentFilters, DocumentItem } from './types'
import { documentsSearchParamsCache } from './utils'

export function DocumentListPage() {
  const { data: documentList } = useSuspenseQuery(getDocumentListQueryOptions())
  const [queryFilter, setQueryFilter] = useQueryState(
    'q',
    parseAsString.withDefault('')
  )

  const searchParams = DocumentListRoute.useSearch()
  const search = documentsSearchParamsCache.parse(searchParams)
  const validFilters = getValidFilters(search.filters as any[])

  const isFiltering = Boolean(queryFilter) || validFilters.length > 0

  const filteredData = React.useMemo(() => {
    const documents = documentList.data ?? []

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
        search.sort as any
      )
    }

    return filteredDocuments
  }, [documentList.data, queryFilter, validFilters, search.sort])

  const documentColumns = useDocumentColumns()

  const { table, debounceMs, shallow, throttleMs } = useDataTable({
    data: filteredData,
    columns: documentColumns,
    pageCount: 1,
    initialState: {
      sorting: [{ id: 'createdAt', desc: false }] as const,
      columnPinning: { right: ['actions'] },
    },
    getRowId: (row) => String(row.id ?? 'unknown'),
    shallow: false,
    clearOnDefault: true,
  })

  return (
    <div className='px-4 py-2'>
      <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Documents</h2>
          <p className='text-muted-foreground'>
            Here&apos;s a list of your documents for this month!
          </p>
        </div>
        <DocumentsPrimaryButtons />
      </div>
      <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
        <React.Suspense fallback={<div>Loading...</div>}>
          <DataTable table={table}>
            <DocumentsTableActionBar table={table} />
            <DataTableAdvancedToolbar table={table}>
              <DataTableSortList table={table} />
              <DataTableFilterMenu
                table={table}
                shallow={shallow}
                debounceMs={debounceMs}
                throttleMs={throttleMs}
              />
              <div className='flex items-center gap-2'>
                <Search
                  className={`absolute top-2.5 left-2 h-4 w-4 ${isFiltering ? 'text-primary' : 'text-muted-foreground'}`}
                />
                <Input
                  placeholder='Search documents...'
                  className={`w-full pl-8 ${isFiltering ? 'border-primary' : ''}`}
                  value={queryFilter}
                  onChange={(e) => void setQueryFilter(e.target.value)}
                />
              </div>
            </DataTableAdvancedToolbar>
          </DataTable>
        </React.Suspense>
      </div>
    </div>
  )
}
