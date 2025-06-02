import { paths } from '@/generated/api-schema'

export type UserItem = NonNullable<
  paths['/api/users']['get']['responses']['200']['content']['*/*']['data']
>[number]
