import { z } from 'zod'

export const envSchema = z.object({
  baseUrl: z.string(),
  dev: z.boolean(),
  mode: z.enum(['development', 'production', 'test', 'staging']),
  prod: z.boolean(),
  ssr: z.boolean(),

  // custom
  viteBaseApi: z
    .string({
      required_error: 'Not set VITE_BASE_API',
      invalid_type_error: 'VITE_BASE_API must be a string',
    })
    .url("VITE_BASE_API isn't a valid url"),
})
