import { createFileRoute } from '@tanstack/react-router'
import PageFormSkeleton from '@/components/page-form-skeleton'
import EditFlightPage from '@/features/flights/edit'
import { getFlightDetailQueryOptions } from '@/features/flights/hooks/use-flight-detail'

export const Route = createFileRoute('/_authenticated/flights/$flight-id/edit')(
  {
    component: EditFlightPage,
    pendingComponent: PageFormSkeleton,
    loader: async ({
      context: { queryClient },
      params: { 'flight-id': flightId },
    }) => {
      await queryClient.ensureQueryData(
        getFlightDetailQueryOptions(Number(flightId))
      )
      return {
        crumb: 'Chỉnh sửa',
      }
    },
  }
)

export { Route as EditFlightRoute }
