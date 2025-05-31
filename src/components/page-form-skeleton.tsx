import { Skeleton } from './ui/skeleton'

export default function PageFormSkeleton() {
  return (
    <div className='px-4 py-2'>
      <div className='mb-6'>
        <Skeleton className='mb-4 h-8 w-1/3' />
        <Skeleton className='mb-6 h-10 w-full' />
        <Skeleton className='mb-2 h-6 w-1/4' />
        <Skeleton className='mb-6 h-32 w-full' />
        <Skeleton className='mb-2 h-6 w-1/4' />
        <Skeleton className='mb-6 h-32 w-full' />
      </div>
      <div className='flex justify-end space-x-2'>
        <Skeleton className='h-10 w-32' />
        <Skeleton className='h-10 w-40' />
      </div>
    </div>
  )
}
