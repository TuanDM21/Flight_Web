import { createFileRoute } from '@tanstack/react-router'
import PageTableSkeleton from '@/components/page-table-skeleton'
import { FlightsPage } from '@/features/flights'
import { flightsQueryOptions } from '@/features/flights/hooks/use-flights'

export const Route = createFileRoute('/_authenticated/flights/')({
  loader: async ({ context }) => {
    const { queryClient } = context
    return queryClient.ensureQueryData(flightsQueryOptions())
  },
  component: FlightsPage,
  pendingComponent: PageTableSkeleton,
})

export { Route as FlightsRoute }
