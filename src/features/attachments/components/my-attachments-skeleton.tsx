import { Card, CardContent, CardHeader } from '@/components/ui/card'
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

        {/* Stats Cards Skeleton */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <Skeleton className='h-4 w-24' /> {/* Card title */}
                <Skeleton className='h-4 w-4' /> {/* Icon */}
              </CardHeader>
              <CardContent>
                <Skeleton className='h-7 w-16' /> {/* Main value */}
                <Skeleton className='mt-1 h-3 w-32' /> {/* Description */}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Data Table Skeleton */}
        <DataTableSkeleton
          columnCount={7} // select, fileName, fileSize, uploadedBy, role, team, createdAt, actions
          rowCount={8}
          filterCount={2} // Search and filter
          withViewOptions={false}
          withPagination={true}
          cellWidths={[
            '48px',
            '200px',
            '100px',
            '150px',
            '100px',
            '120px',
            '120px',
            '80px',
          ]}
        />
      </div>
    </Main>
  )
}
