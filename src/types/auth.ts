import { paths } from '@/generated/api-schema'

export type LoginCredentials =
  paths['/api/auth/login']['post']['requestBody']['content']['application/json'] & {
    remember?: boolean
  }

export type AuthorizedUser =
  paths['/api/users/me']['get']['responses'][200]['content']['*/*']['data']
