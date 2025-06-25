import { createFileRoute } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'
import PageTableSkeleton from '@/components/page-table-skeleton'
import { DocumentsPage } from '@/features/documents'
import { getDocumentListQueryOptions } from '@/features/documents/hooks/use-documents'

function DocumentsPageWrapper() {
  return (
    <Main fixed>
      <DocumentsPage />
    </Main>
  )
}

export const Route = createFileRoute('/_authenticated/documents/')({
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(getDocumentListQueryOptions())
  },
  component: DocumentsPageWrapper,
  pendingComponent: PageTableSkeleton,
})

export { Route as DocumentsRoute }
