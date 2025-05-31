import { paths } from '@/generated/api-schema'
import { OverrideProperties } from 'type-fest'

export type BaseApiResponse<T> = OverrideProperties<
  Required<
    NonNullable<
      paths['/api/auth/login']['post']['responses']['200']['content']['*/*']
    >
  >,
  {
    data: T
  }
>
