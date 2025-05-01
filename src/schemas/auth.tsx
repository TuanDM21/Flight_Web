import { z } from 'zod'
import { LoginCredentials } from '~/types/auth'

export const loginSchema: z.ZodType<LoginCredentials> = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
})
