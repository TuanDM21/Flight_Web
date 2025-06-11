import { createFileRoute } from '@tanstack/react-router'
import PageTableSkeleton from '@/components/page-table-skeleton'
import { DocumentsPage } from '@/features/documents'
import { getDocumentListQueryOptions } from '@/features/documents/hooks/use-documents'

export const Route = createFileRoute('/_authenticated/documents/')({
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(getDocumentListQueryOptions())
  },
  component: DocumentsPage,
  pendingComponent: PageTableSkeleton,
})

export { Route as DocumentsRoute }
