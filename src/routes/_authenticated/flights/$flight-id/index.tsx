import { createFileRoute } from '@tanstack/react-router'
import PageDetailSkeleton from '@/components/page-detail-skeleton'
import FlightDetailPage from '@/features/flights/detail.tsx'
import { getFlightDetailQueryOptions } from '@/features/flights/hooks/use-flight-detail'

export const Route = createFileRoute('/_authenticated/flights/$flight-id/')({
  component: FlightDetailPage,
  pendingComponent: PageDetailSkeleton,
  loader: async ({
    context: { queryClient },
    params: { 'flight-id': flightId },
  }) => {
    await queryClient.ensureQueryData(
      getFlightDetailQueryOptions(Number(flightId))
    )
    return {
      crumb: `Chuyến bay #${flightId}`,
    }
  },
})

export { Route as FlightDetailRoute }
