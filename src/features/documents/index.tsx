import React from 'react'
import { format } from 'date-fns'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { dateFormatPatterns } from '@/config/date'
import { CalendarSearch, FileText, FileTextIcon, Hash } from 'lucide-react'
import { useDataTable } from '@/hooks/use-data-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableAdvancedToolbar } from '@/components/data-table/data-table-advanced-toolbar'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DataTableFilterMenu } from '@/components/data-table/data-table-filter-menu'
import { DataTableSortList } from '@/components/data-table/data-table-sort-list'
import { Search } from '@/components/search'
import { DocumentRowActions } from './components/document-row-actions'
import { DocumentsDialogManager } from './components/documents-dialog-manager'
import { DocumentsPrimaryButtons } from './components/documents-primary-buttons'
import { DocumentsTableActionBar } from './components/documents-table-action-bar'
import DocumentsProvider from './context'
import { getDocumentListQueryOptions } from './hooks/use-view-documents'
import type { DocumentItem } from './types'

export function DocumentListPage() {
  const { data: documentList } = useSuspenseQuery(getDocumentListQueryOptions())
  const [queryFilter, setQueryFilter] = React.useState('')

  // Filter documents based on search
  const filteredData = React.useMemo((): DocumentItem[] => {
    const documents = documentList?.data ?? []

    if (!queryFilter) return documents

    const searchTerm = String(queryFilter).toLowerCase()
    return documents.filter((document) => {
      const content = (document.content || '').toLowerCase()
      const documentType = (document.documentType || '').toLowerCase()
      const notes = (document.notes || '').toLowerCase()

      return (
        content.includes(searchTerm) ||
        documentType.includes(searchTerm) ||
        notes.includes(searchTerm)
      )
    })
  }, [documentList?.data, queryFilter])

  const isFiltering = Boolean(queryFilter)

  const columns = React.useMemo<ColumnDef<DocumentItem>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <div className='px-4 py-2'>
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && 'indeterminate')
              }
              onCheckedChange={(value) => {
                table.toggleAllPageRowsSelected(!!value)
              }}
              aria-label='Select all'
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className='px-4 py-2'>
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => {
                row.toggleSelected(!!value)
              }}
              aria-label='Select row'
            />
          </div>
        ),
        size: 64,
        enableSorting: false,
        enableHiding: false,
        meta: {
          className: 'sticky left-0 bg-background border-r',
        },
      },
      {
        id: 'id',
        accessorKey: 'id',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Document ID' />
        ),
        cell: ({ cell }) => <div>#{cell.getValue<number>() ?? 'N/A'}</div>,
        meta: {
          className: '',
          label: 'Document ID',
          placeholder: 'Search document ID...',
          variant: 'text',
          icon: Hash,
        },
        enableColumnFilter: true,
      },
      {
        id: 'documentType',
        accessorKey: 'documentType',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Document Type' />
        ),
        cell: ({ cell }) => (
          <div className='capitalize'>{cell.getValue<string>() ?? 'N/A'}</div>
        ),
        meta: {
          className: '',
          label: 'Document Type',
          placeholder: 'Search document type...',
          variant: 'text',
          icon: FileText,
        },
        enableColumnFilter: true,
      },
      {
        id: 'content',
        accessorKey: 'content',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Content' />
        ),
        cell: ({ cell }) => <div>{cell.getValue<string>() || 'N/A'}</div>,
        meta: {
          className: '',
          label: 'Content',
          placeholder: 'Search content...',
          variant: 'text',
          icon: FileTextIcon,
        },
        enableColumnFilter: true,
      },
      {
        id: 'createdAt',
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Created At' />
        ),
        cell: ({ cell }) => {
          const value = cell.getValue<string | undefined>()
          if (!value) return <div>Not set</div>

          const date = new Date(value)
          return <div>{format(date, dateFormatPatterns.fullDateTime)}</div>
        },
        meta: {
          className: '',
          label: 'Created At',
          placeholder: 'Filter by creation date...',
          variant: 'date',
          icon: CalendarSearch,
        },
        enableColumnFilter: true,
      },
      {
        id: 'updatedAt',
        accessorKey: 'updatedAt',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Updated At' />
        ),
        cell: ({ cell }) => {
          const value = cell.getValue<string | undefined>()
          if (!value) return <div>Not set</div>

          const date = new Date(value)
          return <div>{format(date, dateFormatPatterns.fullDateTime)}</div>
        },
        meta: {
          className: '',
          label: 'Updated At',
          placeholder: 'Filter by update date...',
          variant: 'date',
          icon: CalendarSearch,
        },
        enableColumnFilter: true,
      },
      {
        id: 'actions',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Actions' />
        ),
        cell: ({ row }) => {
          return <DocumentRowActions row={row} />
        },
        size: 20,
        meta: {
          className: 'sticky right-0 bg-background border-l',
        },
      },
    ],
    []
  )

  const { table, debounceMs, shallow, throttleMs } = useDataTable({
    data: filteredData,
    columns,
    pageCount: 1,
    initialState: {
      sorting: [{ id: 'createdAt', desc: false }],
      columnPinning: { right: ['actions'] },
    },
    getRowId: (row) => String(row.id ?? 'unknown'),
    shallow: false,
    clearOnDefault: true,
  })

  return (
    <DocumentsProvider>
      <DocumentsDialogManager />
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
    </DocumentsProvider>
  )
}
