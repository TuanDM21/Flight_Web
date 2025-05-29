import { createFileRoute } from '@tanstack/react-router'
import PageDetailSkeleton from '@/components/page-detai-skeleton'
import DocumentDetailPage from '@/features/documents/detail'
import { getDocumentDetailQueryOptions } from '@/features/documents/hooks/use-view-document-detail'

export const Route = createFileRoute('/_authenticated/documents/$document-id/')(
  {
    component: DocumentDetailPage,
    pendingComponent: PageDetailSkeleton,
    loader: ({
      context: { queryClient },
      params: { 'document-id': documentId },
    }) => {
      return queryClient.ensureQueryData(
        getDocumentDetailQueryOptions(Number(documentId))
      )
    },
  }
)

export { Route as DocumentDetailRoute }
