import { createFileRoute } from '@tanstack/react-router'
import PageTableSkeleton from '@/components/page-table-skeleton'
import { DocumentListPage } from '@/features/documents'
import { getDocumentListQueryOptions } from '@/features/documents/hooks/use-view-documents'

export const Route = createFileRoute('/_authenticated/documents/')({
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(getDocumentListQueryOptions())
  },
  component: DocumentListPage,
  pendingComponent: PageTableSkeleton,
})

export { Route as DocumentListRoute }
