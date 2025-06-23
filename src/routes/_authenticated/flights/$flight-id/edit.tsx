import { createFileRoute } from '@tanstack/react-router'
import PageFormSkeleton from '@/components/page-form-skeleton'
import EditFlightPage from '@/features/flights/edit'
import { getFlightDetailQueryOptions } from '@/features/flights/hooks/use-flight-detail'

export const Route = createFileRoute('/_authenticated/flights/$flight-id/edit')(
  {
    component: EditFlightPage,
    pendingComponent: PageFormSkeleton,
    loader: ({
      context: { queryClient },
      params: { 'flight-id': flightId },
    }) => {
      return queryClient.ensureQueryData(
        getFlightDetailQueryOptions(Number(flightId))
      )
    },
  }
)

export { Route as EditFlightRoute }
