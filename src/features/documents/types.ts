import { z } from 'zod'
import { paths } from '@/generated/api-schema'
import { createDocumentSchema } from './schema'

export type DocumentsResponse =
  paths['/api/documents']['get']['responses']['200']['content']['*/*']

export type DocumentItem = NonNullable<DocumentsResponse['data']>[number]

export type CreateDocumentForm = z.infer<typeof createDocumentSchema>
