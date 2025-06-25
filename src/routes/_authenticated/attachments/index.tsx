import { createFileRoute } from '@tanstack/react-router'
import { MyAttachmentsSkeleton } from '@/features/attachments/components/my-attachments-skeleton'
import { myAttachmentsQueryOptions } from '@/features/attachments/hooks/use-my-attachments'
import MyAttachmentsPage from '@/features/attachments/my-attachments'

export const Route = createFileRoute('/_authenticated/attachments/')({
  component: MyAttachmentsPage,
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(myAttachmentsQueryOptions())
    return {
      crumb: 'Tệp của tôi',
    }
  },
  pendingComponent: MyAttachmentsSkeleton,
})

export { Route as MyAttachmentsRoute }
