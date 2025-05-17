import { Skeleton } from './ui/skeleton'

interface TaskHeaderSkeletonProps {
  withFilter?: boolean
  withSort?: boolean
  withView?: boolean
}

export function TaskHeaderSkeleton({
  withFilter = true,
  withSort = true,
  withView = true,
}: TaskHeaderSkeletonProps) {
  return (
    <div className='w-full'>
      <div className='mb-6'>
        <Skeleton className='mb-2 h-8 w-[150px]' />
        <Skeleton className='h-5 w-[350px]' />
      </div>

      <div className='mb-6 flex flex-wrap items-center justify-between gap-4'>
        {withSort && (
          <div className='flex items-center gap-2'>
            <Skeleton className='h-9 w-[100px] rounded-md' />
            <Skeleton className='h-4 w-4' />
          </div>
        )}

        {withFilter && (
          <div className='flex items-center gap-2'>
            <Skeleton className='h-9 w-[100px] rounded-md' />
            <Skeleton className='h-4 w-4' />
          </div>
        )}

        {withView && (
          <div className='ml-auto flex items-center gap-2'>
            <Skeleton className='h-9 w-[100px] rounded-md' />
            <Skeleton className='h-4 w-4' />
          </div>
        )}
      </div>
    </div>
  )
}
