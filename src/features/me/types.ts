import { paths } from '@/generated/api-schema'

export type UserProfile = NonNullable<
  paths['/api/users/me']['get']['responses']['200']['content']['*/*']['data']
>
