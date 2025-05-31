import { DataTableSkeleton } from './data-table/data-table-skeleton'
import { TaskHeaderSkeleton } from './task-header-skeleton'

export default function PageTableSkeleton() {
  return (
    <div className='px-4 py-2'>
      <TaskHeaderSkeleton />
      <DataTableSkeleton
        columnCount={10}
        rowCount={10}
        withViewOptions={false}
      />
    </div>
  )
}
