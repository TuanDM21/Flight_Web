import { createFileRoute } from '@tanstack/react-router'
import { MyAttachmentsSkeleton } from '@/features/attachments/components/my-attachments-skeleton'
import { getMyAttachmentsQueryOptions } from '@/features/attachments/hooks/use-my-attachments'
import MyAttachmentsPage from '@/features/attachments/my-attachments'

export const Route = createFileRoute('/_authenticated/attachments/')({
  component: MyAttachmentsPage,
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(getMyAttachmentsQueryOptions())
  },
  pendingComponent: MyAttachmentsSkeleton,
})

export { Route as MyAttachmentsRoute }
