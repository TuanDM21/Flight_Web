import { paths } from '@/generated/api-schema'

export type Document = NonNullable<
  paths['/api/documents']['get']['responses']['200']['content']['*/*']['data']
>[number]
