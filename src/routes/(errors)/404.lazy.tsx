import { createLazyFileRoute } from '@tanstack/react-router'
import NotFoundError from '~/components/errors/not-found-error'

export const Route = createLazyFileRoute('/(errors)/404')({
  component: NotFoundError,
})
