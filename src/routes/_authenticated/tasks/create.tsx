import { createFileRoute } from '@tanstack/react-router'
import CreateTaskPage from '@/features/tasks/create'

export const Route = createFileRoute('/_authenticated/tasks/create')({
  component: CreateTaskPage,
})
