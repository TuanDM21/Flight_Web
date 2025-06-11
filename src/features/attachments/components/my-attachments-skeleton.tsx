import { Skeleton } from '@/components/ui/skeleton'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { Main } from '@/components/layout/main'

export function MyAttachmentsSkeleton() {
  return (
    <Main>
      <div className='space-y-6'>
        {/* Header Skeleton */}
        <div className='flex items-center justify-between'>
          <div>
            <Skeleton className='h-9 w-48' /> {/* Title */}
            <Skeleton className='mt-2 h-5 w-80' /> {/* Description */}
          </div>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-9 w-24' /> {/* Refresh button */}
            <Skeleton className='h-9 w-32' /> {/* Upload button */}
          </div>
        </div>

        {/* Data Table Skeleton */}
        <DataTableSkeleton
          columnCount={8} // select, id, fileName, fileExtension, fileSize, sharedCount, createdAt, actions
          rowCount={8}
          filterCount={2} // Search and filter
          withViewOptions={false}
          withPagination={true}
          cellWidths={[
            '48px', // select
            '60px', // id
            '200px', // fileName
            '80px', // fileExtension
            '100px', // fileSize
            '100px', // sharedCount
            '120px', // createdAt
            '80px', // actions
          ]}
        />
      </div>
    </Main>
  )
}
