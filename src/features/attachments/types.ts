import { paths } from '@/generated/api-schema'

export type MyAttachmentItem = NonNullable<
  paths['/api/attachments/my-files']['get']['responses']['200']['content']['*/*']['data']
>[number]
