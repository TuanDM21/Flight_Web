import { createFileRoute } from '@tanstack/react-router'
import { MyAttachmentsSkeleton } from '@/features/attachments/components/my-attachments-skeleton'
import { sharedWithMeAttachmentsQueryOptions } from '@/features/attachments/hooks/use-shared-with-me-attachments'
import SharedWithMeAttachmentsPage from '@/features/attachments/shared-with-me'

export const Route = createFileRoute(
  '/_authenticated/attachments/shared-with-me'
)({
  component: SharedWithMeAttachmentsPage,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(sharedWithMeAttachmentsQueryOptions())
    return {
      crumb: 'Được chia sẻ',
    }
  },
  pendingComponent: MyAttachmentsSkeleton,
})

export { Route as SharedWithMeAttachmentsRoute }
