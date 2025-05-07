import { z } from 'zod'

export const createTaskSchema = z.object({
  content: z.string().min(1, { message: 'Content is required' }),
  instructions: z.string().min(1, { message: 'Instructions are required' }),
  notes: z.string().optional(),
  assignments: z
    .array(
      z.object({
        recipientId: z.number().optional(),
        recipientType: z.string().optional(),
        dueAt: z.string().optional(),
        note: z.string().optional(),
      })
    )
    .min(1, { message: 'At least one assignee is required' }),

  attachments: z
    .array(z.custom<File>())
    .min(1, { message: 'Please select at least one file' })
    .max(5, { message: 'Please select up to 5 files' })
    .refine((files) => files.every((file) => file.size <= 10 * 1024 * 1024), {
      message: 'File size must be less than 10MB',
      path: ['attachments'],
    }),
})

// assignmentId?: number;
//     taskId?: number;
//     recipientId?: number;
//     recipientType?: string;
//     assignedBy?: number;
//     assignedAt?: string;
//     dueAt?: string;
//     completedAt?: string;
//     completedBy?: number;
//     status?: number;
//     note?: string;
