export default function PageDetailSkeleton() {
  return (
    <div className='px-4 py-2'>
      <div className='animate-pulse space-y-4'>
        <div className='h-6 w-1/3 rounded bg-gray-200'></div>
        <div className='h-4 w-1/4 rounded bg-gray-200'></div>
        <div className='h-4 w-1/2 rounded bg-gray-200'></div>
        <div className='h-4 w-full rounded bg-gray-200'></div>
        <div className='h-4 w-full rounded bg-gray-200'></div>
      </div>
    </div>
  )
}
