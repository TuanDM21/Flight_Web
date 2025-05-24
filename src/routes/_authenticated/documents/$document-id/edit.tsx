import { createFileRoute } from '@tanstack/react-router'
import PageFormSkeleton from '@/components/page-form-skeleton'
import EditDocumentPage from '@/features/documents/edit'
import { getDocumentDetailQueryOptions } from '@/features/documents/hooks/use-view-document-detail'

export const Route = createFileRoute(
  '/_authenticated/documents/$document-id/edit'
)({
  component: EditDocumentPage,
  pendingComponent: PageFormSkeleton,
  loader: ({
    context: { queryClient },
    params: { 'document-id': documentId },
  }) => {
    return queryClient.ensureQueryData(
      getDocumentDetailQueryOptions(Number(documentId))
    )
  },
})

export { Route as EditDocumentRoute }
