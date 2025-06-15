import React from 'react';
import { Search } from 'lucide-react';
import { useDataTable } from '@/hooks/use-data-table';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableAdvancedToolbar } from '@/components/data-table/data-table-advanced-toolbar';
import { DataTableFilterMenu } from '@/components/data-table/data-table-filter-menu';
import { DataTableSortList } from '@/components/data-table/data-table-sort-list'
import { DocumentsPrimaryButtons } from './components/documents-primary-buttons';
import { DocumentsTableActionBar } from './components/documents-table-action-bar';
import { useDocumentColumns } from './hooks/use-document-columns';
import { useDocumentsSearchFilter } from './hooks/use-documents-search-filter';


export function DocumentsPage() {
  const { filteredData, isFiltering, queryFilter, setQueryFilter } =
    useDocumentsSearchFilter()

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
          <h2 className='text-2xl font-bold tracking-tight'>Tài liệu</h2>
          <p className='text-muted-foreground'>
            Đây là danh sách tài liệu của bạn trong tháng này!
          </p>
        </div>
        <DocumentsPrimaryButtons />
      </div>
      <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
        <React.Suspense fallback={<div>Đang tải...</div>}>
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
                  placeholder='Tìm kiếm tài liệu...'
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
