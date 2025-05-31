import { z } from 'zod'
import { MAX_FILE_SIZE, MAX_FILES_COUNT } from './constants'

export const createDocumentSchema = z.object({
  documentType: z.string().min(1, 'Document type is required'),
  content: z.string().min(1, 'Content is required'),
  notes: z.string().min(1, 'Notes are required'),
  files: z
    .array(z.custom<File>())
    .min(1, 'Please select at least one file')
    .max(MAX_FILES_COUNT, `Please select up to ${MAX_FILES_COUNT} files`)
    .refine((files) => files.every((file) => file.size <= MAX_FILE_SIZE), {
      message: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      path: ['files'],
    })
    .refine(
      (files) =>
        files.reduce((acc, file) => acc + file.size, 0) <=
        MAX_FILE_SIZE * MAX_FILES_COUNT,
      {
        message: 'Total files size must be less than 50MB',
        path: ['files'],
      }
    )
    .default([])
    .optional(),

  attachments: z
    .array(
      z.object({
        id: z.number(),
        filePath: z.string(),
        fileName: z.string(),
        fileSize: z.number(),
        createdAt: z.string(),
      })
    )
    .default([])
    .optional(),
})
