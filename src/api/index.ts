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
  onResponse: ({ response, request }) => {
    if (!response.ok) {
      const error = new FetchError({
        message: `Request failed with status ${response.status}`,
        request,
        response,
        status: response.status,
      })
      throw error
    }
    if (!navigator.onLine) {
      const error = new FetchError({
        message: 'Network error: You are offline',
        request,
        response,
        status: 0,
      })
      throw FetchError.networkError(error, request)
    }
  },
})

const $queryClient = createClient(fetchClient)

export default $queryClient
