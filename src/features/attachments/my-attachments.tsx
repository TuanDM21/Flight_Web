import { useSuspenseQuery } from '@tanstack/react-query'
import { RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { Main } from '@/components/layout/main'
import { AddFilesAction } from './components/add-files-action'
import { AttachmentsStats } from './components/attachments-stats'
import { AttachmentsStatsSkeleton } from './components/attachments-stats-skeleton'
import { AttachmentsTable } from './components/attachments-table'
import { getMyAttachmentsQueryOptions } from './hooks/use-my-attachments'

export default function MyAttachmentsPage() {
  const {
    data: attachmentsResponse,
    isLoading,
    error,
    refetch,
  } = useSuspenseQuery(getMyAttachmentsQueryOptions())

  const attachments = attachmentsResponse?.data || []

  const handleRefresh = () => {
    refetch()
  }

  if (error) {
    return (
      <Main>
        <div className='flex h-64 items-center justify-center'>
          <div className='text-center'>
            <p className='text-destructive mb-4'>Failed to load attachments</p>
            <Button onClick={handleRefresh} variant='outline'>
              <RefreshCcw className='mr-2 h-4 w-4' />
              Try Again
            </Button>
          </div>
        </div>
      </Main>
    )
  }

  return (
    <Main>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Attachments</h1>
            <p className='text-muted-foreground'>
              Manage and organize your uploaded files
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCcw
                className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
            <AddFilesAction />
          </div>
        </div>

        {isLoading ? (
          <AttachmentsStatsSkeleton />
        ) : (
          <AttachmentsStats data={attachments} />
        )}

        {isLoading ? (
          <DataTableSkeleton
            columnCount={8}
            rowCount={10}
            filterCount={2}
            withViewOptions
            withPagination
          />
        ) : (
          <AttachmentsTable data={attachments} />
        )}
      </div>
    </Main>
  )
}
