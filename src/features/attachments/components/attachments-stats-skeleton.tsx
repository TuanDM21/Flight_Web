import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Main } from '@/components/layout/main'

export function AttachmentsStatsSkeleton() {
  return (
    <Main>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <div className='bg-muted h-4 w-20 animate-pulse rounded' />
              <div className='bg-muted h-4 w-4 animate-pulse rounded' />
            </CardHeader>
            <CardContent>
              <div className='bg-muted mb-2 h-8 w-16 animate-pulse rounded' />
              <div className='bg-muted h-3 w-24 animate-pulse rounded' />
            </CardContent>
          </Card>
        ))}
      </div>
    </Main>
  )
}
