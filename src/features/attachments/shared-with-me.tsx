import { Suspense } from 'react'
import { Search } from 'lucide-react'
import { useDataTable } from '@/hooks/use-data-table'
import { Input } from '@/components/ui/input'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableAdvancedToolbar } from '@/components/data-table/data-table-advanced-toolbar'
import { DataTableFilterMenu } from '@/components/data-table/data-table-filter-menu'
import { DataTableSortList } from '@/components/data-table/data-table-sort-list'
import { Main } from '@/components/layout/main'
import { DocumentsTableActionBar } from '../documents/components/documents-table-action-bar'
import { SharedWithMeAttachmentsPrimaryButtons } from './components/shared-with-me-attachments-primary-buttons'
import { useShareWithMeSearchFilter } from './hooks/use-share-with-me-search-filter'
import { useSharedWithMeAttachmentTableColumns } from './hooks/use-shared-with-me-attachment-table-columns'

export default function SharedWithMeAttachmentsPage() {
  const { filteredData, isFiltering, queryFilter, setQueryFilter } =
    useShareWithMeSearchFilter()

  const sharedWithMeAttachmentColumns = useSharedWithMeAttachmentTableColumns()

  const { table, debounceMs, shallow, throttleMs } = useDataTable({
    data: filteredData,
    columns: sharedWithMeAttachmentColumns,
    pageCount: 1,
    initialState: {
      sorting: [{ id: 'sharedAt', desc: true }] as const,
      columnPinning: { right: ['actions'] },
    },
    shallow: false,
    clearOnDefault: true,
  })

  return (
    <Main>
      <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>
            Tệp đính kèm được chia sẻ với tôi
          </h2>
        </div>
        <SharedWithMeAttachmentsPrimaryButtons />
      </div>
      <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
        <Suspense fallback={<div>Đang tải...</div>}>
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
                  placeholder='Tìm kiếm tệp đính kèm...'
                  className={`w-full pl-8 ${isFiltering ? 'border-primary' : ''}`}
                  value={queryFilter}
                  onChange={(e) => void setQueryFilter(e.target.value)}
                />
              </div>
            </DataTableAdvancedToolbar>
          </DataTable>
        </Suspense>
      </div>
    </Main>
  )
}
