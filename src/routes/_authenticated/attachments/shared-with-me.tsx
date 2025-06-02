import { createFileRoute } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'

export const Route = createFileRoute(
  '/_authenticated/attachments/shared-with-me'
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Main>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Shared with me</h1>
          <p className='text-muted-foreground'>
            Files that have been shared with you by other users.
          </p>
        </div>
      </div>

      <div className='flex h-full flex-col items-center justify-center space-y-4 py-8'>
        <div className='bg-muted rounded-full p-4'>
          <svg
            className='text-muted-foreground h-8 w-8'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        </div>
        <div className='space-y-2 text-center'>
          <h3 className='text-muted-foreground text-lg font-medium'>
            Coming Soon
          </h3>
          <p className='text-muted-foreground text-sm'>
            The shared files feature is currently under development.
          </p>
        </div>
      </div>
    </Main>
  )
}
