import { z } from 'zod'

export const assignmentsSchema = z
  .array(
    z.object({
      recipientType: z.string().min(1, 'Please select a recipient type'),
      recipientId: z
        .number({ message: 'Please select a recipient' })
        .int('Please select a valid recipient'),
      dueAt: z.string({ message: 'Please select a due date' }),
      note: z.string().optional(),
    })
  )
  .default([])
  .optional()
export const createTaskSchema = z.object({
  content: z.string().min(1, { message: 'Please enter task content' }),
  instructions: z
    .string()
    .min(1, { message: 'Please enter task instructions' }),
  notes: z.string().optional(),
  assignments: assignmentsSchema,

  documentIds: z
    .array(z.number().min(1, { message: 'Please select valid documents' }))
    .default([])
    .optional(),
})

export const updateTaskAssignmentSchema = z.object({
  recipientId: z.number({ message: 'Please select a recipient' }),
  recipientType: z
    .string()
    .min(1, { message: 'Please select a recipient type' }),
  dueAt: z.string({ message: 'Please select a due date' }),
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
