import { createFileRoute } from '@tanstack/react-router'
import CreateDocumentPage from '@/features/documents/create'

export const Route = createFileRoute('/_authenticated/documents/create')({
  component: CreateDocumentPage,
  loader: async () => {
    return {
      crumb: 'Tạo tài liệu',
    }
  },
})

export { Route as CreateDocumentRoute }
