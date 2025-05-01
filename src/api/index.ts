import createFetchClient from 'openapi-fetch'
import createClient from 'openapi-react-query'
import { paths } from '~/generated/api-schema'
import { envVariables } from '~/lib/env'

export const fetchClient = createFetchClient<paths>({
  baseUrl: envVariables.viteBaseApi,
})

fetchClient.use({
  onRequest: async ({ request }) => {
    const tokenKey = 'tanstack.auth.token'
    const token = localStorage.getItem(tokenKey)

    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`)
    }
  },
})

const $queryClient = createClient(fetchClient)

export default $queryClient
