import { z } from 'zod'

export const assignmentsSchema = z
  .array(
    z.object({
      recipientType: z.string().min(1, 'Recipient type is required'),
      recipientId: z.number().int('Recipient ID must be an integer'),
      dueAt: z.string().min(1, 'Due date is required'),
      note: z.string().optional(),
    })
  )
  .default([])
  .optional()
export const createTaskSchema = z.object({
  content: z.string().min(1, { message: 'This field is required' }),
  instructions: z.string().min(1, { message: 'This field is required' }),
  notes: z.string().optional(),
  assignments: assignmentsSchema,

  documentIds: z
    .array(z.number().min(1, { message: 'This field is required' }))
    .default([])
    .optional(),
})

export const updateTaskAssignmentSchema = z.object({
  recipientId: z.number({ message: 'This field is required' }),
  recipientType: z.string().min(1, { message: 'This field is required' }),
  dueAt: z.string(),
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
