import { paths } from '@/generated/api-schema'

export type DocumentsResponse =
  paths['/api/documents']['get']['responses']['200']['content']['*/*']

export type Document = NonNullable<DocumentsResponse['data']>
