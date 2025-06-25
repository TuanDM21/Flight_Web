import { Suspense } from 'react'
import { useDataTable } from '@/hooks/use-data-table'
import { Input } from '@/components/ui/input'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableAdvancedToolbar } from '@/components/data-table/data-table-advanced-toolbar'
import { DataTableFilterMenu } from '@/components/data-table/data-table-filter-menu'
import { DataTableSortList } from '@/components/data-table/data-table-sort-list'
import { Main } from '@/components/layout/main'
import { AttachmentsPrimaryButtons } from './components/attachments-primary-buttons'
import { AttachmentsTableActionBar } from './components/attachments-table-action-bar'
import { useAttachmentTableColumns } from './hooks/use-attachment-table-columns'
import { useAttachmentsSearchFilter } from './hooks/use-attachments-search-filter'

export default function MyAttachmentsPage() {
  const { filteredData, isFiltering, queryFilter, setQueryFilter } =
    useAttachmentsSearchFilter()

  const attachmentsColumns = useAttachmentTableColumns()

  const { table, debounceMs, shallow, throttleMs } = useDataTable({
    data: filteredData,
    columns: attachmentsColumns,
    pageCount: 1,
    initialState: {
      sorting: [{ id: 'createdAt', desc: false }] as const,
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
            Tệp đính kèm của tôi
          </h2>
        </div>
        <AttachmentsPrimaryButtons />
      </div>
      <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
        <Suspense fallback={<div>Đang tải...</div>}>
          <DataTable table={table}>
            <AttachmentsTableActionBar table={table} />
            <DataTableAdvancedToolbar table={table}>
              <DataTableSortList table={table} />
              <DataTableFilterMenu
                table={table}
                shallow={shallow}
                debounceMs={debounceMs}
                throttleMs={throttleMs}
              />
              <div className='flex items-center gap-2'>
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
