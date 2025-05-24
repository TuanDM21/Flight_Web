import { z } from 'zod'

export const createDocumentSchema = z.object({
  documentType: z.string().min(1, 'Document type is required'),
  content: z.string().min(1, 'Content is required'),
  notes: z.string().min(1, 'Notes are required'),
  // attachmentIds: z.array(z.number()).default([]).optional(),
  // files: z
  //   .array(z.custom<File>())
  //   .min(1, 'Please select at least one file')
  //   .max(2, 'Please select up to 2 files')
  //   .refine((files) => files.every((file) => file.size <= 5 * 1024 * 1024), {
  //     message: 'File size must be less than 5MB',
  //     path: ['files'],
  //   })
  //   .default([])
  //   .optional(),
})
