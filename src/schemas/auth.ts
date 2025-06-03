import { z } from 'zod'
import { LoginCredentials } from '@/types/auth'

export const loginSchema: z.ZodType<LoginCredentials> = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(6, {
      message: 'Password must be at least 7 characters long',
    }),
  remember: z.boolean().optional(),
})
