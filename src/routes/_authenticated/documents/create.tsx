import { createFileRoute } from '@tanstack/react-router'
import CreateDocumentPage from '@/features/documents/create'

export const Route = createFileRoute('/_authenticated/documents/create')({
  component: CreateDocumentPage,
})

export { Route as CreateDocumentRoute }
