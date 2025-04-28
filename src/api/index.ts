import createClient from 'openapi-fetch'
import { paths } from '~/generated/api-schema'
import { envVariables } from '~/lib/env'

export const client = createClient<paths>({ baseUrl: envVariables.viteBaseApi })
