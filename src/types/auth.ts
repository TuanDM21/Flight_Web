import { z } from 'zod'
import { loginSchema } from '~/schemas/auth'

export type LoginCredentials = z.infer<typeof loginSchema>
