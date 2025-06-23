import { z } from 'zod'

export const assignmentsSchema = z
  .array(
    z.object({
      recipientType: z.string().min(1, 'Vui lòng chọn loại người nhận'),
      recipientId: z
        .number({ message: 'Vui lòng chọn người nhận' })
        .int('Vui lòng chọn người nhận hợp lệ'),
      dueAt: z.string({ message: 'Vui lòng chọn ngày hạn' }),
      note: z.string().optional(),
    })
  )
  .default([])
  .optional()

// Schema for creating new documents within task
export const newDocumentItemSchema = z.object({
  documentType: z.string().min(1, 'Loại tài liệu là bắt buộc'),
  content: z.string().min(1, 'Nội dung là bắt buộc'),
  notes: z.string().min(1, 'Ghi chú là bắt buộc'),
  files: z.array(z.custom<File>()).default([]).optional(),
  attachments: z.array(z.any()).default([]).optional(),
})

export const createTaskSchema = z.object({
  content: z.string().min(1, { message: 'Vui lòng nhập nội dung nhiệm vụ' }),
  instructions: z
    .string()
    .min(1, { message: 'Vui lòng nhập hướng dẫn nhiệm vụ' }),
  notes: z.string().optional(),
  assignments: assignmentsSchema,

  documentIds: z
    .array(z.number().min(1, { message: 'Vui lòng chọn tài liệu hợp lệ' }))
    .default([])
    .optional(),

  // New fields for creating documents (each document has its own files/attachments)
  documents: z.array(newDocumentItemSchema).default([]).optional(),
})

export const updateTaskAssignmentSchema = z.object({
  recipientId: z.number({ message: 'Vui lòng chọn người nhận' }),
  recipientType: z
    .string()
    .min(1, { message: 'Vui lòng chọn loại người nhận' }),
  dueAt: z.string({ message: 'Vui lòng chọn ngày hạn' }),
  note: z.string().optional(),
  status: z.enum([
    'ASSIGNED',
    'IN_PROGRESS',
    'SUBMITTED',
    'REVIEWING',
    'REJECTED',
    'COMPLETED',
    'LATE_COMPLETED',
    'REOPENED',
    'CANCELLED',
  ]),
})

export const createTaskAssignmentsSchema = z.object({
  assignments: assignmentsSchema,
})
