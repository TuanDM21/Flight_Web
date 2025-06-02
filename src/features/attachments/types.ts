import { paths } from '@/generated/api-schema'

export type AttachmentItem = NonNullable<
  paths['/api/attachments/my-files']['get']['responses']['200']['content']['*/*']['data']
>[number]

export type SharedAttachmentUserItem = NonNullable<
  paths['/api/attachments/{attachmentId}/shares']['get']['responses']['200']['content']['*/*']['data']
>[number]

export type SharedWithMeAttachmentItem = NonNullable<
  paths['/api/attachments/shared-with-me']['get']['responses']['200']['content']['*/*']['data']
>[number]

export type AttachmentFilters = Omit<AttachmentItem, 'uploadedBy'>
export type SharedAttachmentFilters = Omit<
  SharedWithMeAttachmentItem,
  'sharedBy' | 'sharedWith'
>
