import { z } from 'zod'

export const createTaskSchema = z.object({
  content: z.string().min(1, { message: 'Content is required' }),
  instructions: z.string().min(1, { message: 'Instructions are required' }),
  notes: z.string().optional(),
  assignments: z
    .array(
      z.object({
        recipientId: z.number(),
        recipientType: z
          .string()
          .min(1, 'Please select at least one assignee type'),
        dueAt: z.string(),
        note: z.string().optional(),
      })
    )
    .default([])
    .optional(),

  documents: z
    .array(
      z.object({
        documentId: z.number(),
        documentType: z
          .string()
          .min(1, { message: 'Document type is required' }),
        content: z.string().min(1, { message: 'Document content is required' }),
        notes: z.string(),
        attachments: z.array(
          z.object({
            filePath: z.string(),
            fileName: z.string(),
          })
        ),
      })
    )
    .default([])
    .optional(),
})
