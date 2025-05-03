import { AUTH_TOKEN_KEY } from '@/config/auth'
import { paths } from '@/generated/api-schema'
import { FetchError } from '@/models/fetch-error'
import createFetchClient from 'openapi-fetch'
import createClient from 'openapi-react-query'
import { envVariables } from '@/lib/env'

export const fetchClient = createFetchClient<paths>({
  baseUrl: envVariables.viteBaseApi,
})

fetchClient.use({
  onRequest: ({ request }) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)

    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`)
    }
  },
  onResponse: ({ response }) => {
    if (!response.ok) {
      throw FetchError.fromResponse(response)
    }
  },
  onError: ({ error, request }) => {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return FetchError.networkError(new Error(message), request)
  },
})

const $queryClient = createClient(fetchClient)

export default $queryClient
