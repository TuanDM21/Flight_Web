import { createFileRoute } from '@tanstack/react-router'
import PageDetailSkeleton from '@/components/page-detail-skeleton'
import AttachmentDetailPage from '@/features/attachments/detail'
import { getAttachmentDetailQueryOptions } from '@/features/attachments/hooks/use-attachment-detail'
import { getUsersSharedWithFileQueryOptions } from '@/features/attachments/hooks/use-user-shared-with-file'

export const Route = createFileRoute(
  '/_authenticated/attachments/$attachment-id/'
)({
  component: AttachmentDetailPage,
  pendingComponent: PageDetailSkeleton,
  loader: async ({
    context: { queryClient },
    params: { 'attachment-id': attachmentId },
  }) => {
    const [attachmentDetail, usersSharedWithFile] = await Promise.all([
      queryClient.ensureQueryData(
        getAttachmentDetailQueryOptions(Number(attachmentId))
      ),
      queryClient.ensureQueryData(
        getUsersSharedWithFileQueryOptions(Number(attachmentId))
      ),
    ])

    return {
      attachmentDetail,
      usersSharedWithFile,
    }
  },
})

export { Route as AttachmentDetailRoute }
