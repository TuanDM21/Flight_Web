import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
})

export type Task = {
  id: number
  content: string
  created_at: string
  updated_at: string
  created_by: { id: number; name: string }
  assignments: {
    recipient_id: number
    recipient_type: 'user' | 'team' | 'unit'
    status: 0 | 1 | 2
    assigned_at: string
    due_at: string
    completed_at: string | null
    completed_by: number | null
  }[]
}
