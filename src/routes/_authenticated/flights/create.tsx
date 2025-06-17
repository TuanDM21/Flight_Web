import { createFileRoute } from '@tanstack/react-router'
import { CreateFlightPage } from '@/features/flights/create'

export const Route = createFileRoute('/_authenticated/flights/create')({
  component: CreateFlightPage,
})

export { Route as CreateFlightRoute }
