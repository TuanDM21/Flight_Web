import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import PageTableSkeleton from '@/components/page-table-skeleton'
import { TasksPage } from '@/features/tasks'
import { tasksQueryOptions } from '@/features/tasks/hooks/use-tasks'

export const Route = createFileRoute('/_authenticated/tasks/')({
  loader: async ({ context }) => {
    const { queryClient } = context
    return queryClient.ensureQueryData(tasksQueryOptions('assigned'))
  },
  validateSearch: (search) =>
    z
      .object({
        type: z.enum(['created', 'assigned', 'received']).optional(),
      })
      .parse(search),
  component: TasksPage,
  pendingComponent: PageTableSkeleton,
})

export { Route as TasksRoute }
