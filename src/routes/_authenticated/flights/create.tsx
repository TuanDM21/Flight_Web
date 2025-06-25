import { createFileRoute } from '@tanstack/react-router'
import { CreateFlightPage } from '@/features/flights/create'

export const Route = createFileRoute('/_authenticated/flights/create')({
  component: CreateFlightPage,
  loader: async () => {
    return {
      crumb: 'Tạo chuyến bay',
    }
  },
})

export { Route as CreateFlightRoute }
