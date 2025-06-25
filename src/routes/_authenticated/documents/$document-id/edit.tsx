import { createFileRoute, redirect } from '@tanstack/react-router'
import PageFormSkeleton from '@/components/page-form-skeleton'
import EditDocumentPage from '@/features/documents/edit'
import { getDocumentDetailQueryOptions } from '@/features/documents/hooks/use-document-detail'

export const Route = createFileRoute(
  '/_authenticated/documents/$document-id/edit'
)({
  component: EditDocumentPage,
  pendingComponent: PageFormSkeleton,
  loader: async ({
    context: {
      queryClient,
      auth: { user },
    },
    params: { 'document-id': documentId },
  }) => {
    const { data: documentDetails } = await queryClient.ensureQueryData(
      getDocumentDetailQueryOptions(Number(documentId))
    )
    const isDocumentOwner = user?.id === documentDetails?.createdByUser?.id
    if (!isDocumentOwner) {
      throw redirect({
        to: '/404',
        search: {
          redirect: location.href,
        },
      })
    }

    return {
      crumb: 'Chỉnh sửa',
    }
  },
})

export { Route as EditDocumentRoute }
