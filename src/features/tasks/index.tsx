import { Suspense } from 'react'
import { useDataTable } from '@/hooks/use-data-table'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableAdvancedToolbar } from '@/components/data-table/data-table-advanced-toolbar'
import { DataTableFilterMenu } from '@/components/data-table/data-table-filter-menu'
import { DataTableSortList } from '@/components/data-table/data-table-sort-list'
import { TaskSearchInput } from './components/task-search-input'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import { TasksTableActionBar } from './components/tasks-table-action-bar'
import { TasksTypeFilter } from './components/tasks-type-filter'
import { useTasksSearchFilter } from './hooks/use-tasks-search-filter'
import { useTasksTableColumns } from './hooks/use-tasks-table-columns'

export function TasksPage() {
  const { filteredData, isFiltering } = useTasksSearchFilter()
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
      <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Tasks</h2>
          <p className='text-muted-foreground'>
            Here&apos;s a list of your tasks for this month!
          </p>
        </div>
        <TasksPrimaryButtons />
      </div>
      <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
        <Suspense fallback={<div>Loading...</div>}>
          <DataTable table={table}>
            <TasksTableActionBar table={table} />
            <DataTableAdvancedToolbar table={table}>
              <TasksTypeFilter />
              <DataTableSortList table={table} />
              <DataTableFilterMenu
                table={table}
                shallow={shallow}
                debounceMs={debounceMs}
                throttleMs={throttleMs}
              />
              <TaskSearchInput isFiltering={isFiltering} />
            </DataTableAdvancedToolbar>
          </DataTable>
        </Suspense>
      </div>
    </div>
  )
}
