import { Suspense } from 'react'
import { useDataTable } from '@/hooks/use-data-table'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableAdvancedToolbar } from '@/components/data-table/data-table-advanced-toolbar'
import { DataTableFilterMenu } from '@/components/data-table/data-table-filter-menu'
import { DataTableSortList } from '@/components/data-table/data-table-sort-list'
import { TaskSearchInput } from './components/task-search-input'
import { TaskTypeFilter } from './components/task-type-filter'
import { TasksPageHeader } from './components/tasks-page-header'
import { TasksTableActionBar } from './components/tasks-table-action-bar'
import { useTasksTableColumns } from './hooks/use-tasks-table-columns'
import { useTasksWithFiltering } from './hooks/use-tasks-with-filtering'

export function TasksPage() {
  const { filteredData, isFiltering } = useTasksWithFiltering()
  const columns = useTasksTableColumns()
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
    <div className='px-4 py-2'>
      <TasksPageHeader />
      <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
        <Suspense fallback={<div>Loading...</div>}>
          <DataTable table={table}>
            <TasksTableActionBar table={table} />
            <DataTableAdvancedToolbar table={table}>
              <DataTableSortList table={table} />
              <DataTableFilterMenu
                table={table}
                shallow={shallow}
                debounceMs={debounceMs}
                throttleMs={throttleMs}
              />
              <TaskSearchInput isFiltering={isFiltering} />
              <TaskTypeFilter />
            </DataTableAdvancedToolbar>
          </DataTable>
        </Suspense>
      </div>
    </div>
  )
}
