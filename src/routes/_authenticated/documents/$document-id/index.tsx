import { createFileRoute } from '@tanstack/react-router'
import PageDetailSkeleton from '@/components/page-detail-skeleton'
import DocumentDetailPage from '@/features/documents/detail'
import { getDocumentDetailQueryOptions } from '@/features/documents/hooks/use-document-detail'

export const Route = createFileRoute('/_authenticated/documents/$document-id/')(
  {
    component: DocumentDetailPage,
    pendingComponent: PageDetailSkeleton,
    loader: async ({
      context: { queryClient },
      params: { 'document-id': documentId },
    }) => {
      await queryClient.ensureQueryData(
        getDocumentDetailQueryOptions(Number(documentId))
      )
      return {
        crumb: `Tài liệu #${documentId}`,
      }
    },
  }
)

export { Route as DocumentDetailRoute }
