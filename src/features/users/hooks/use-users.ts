import { useSuspenseQuery } from '@tanstack/react-query'
import $queryClient from '@/api'

export const usersQueryOptions = () =>
  $queryClient.queryOptions('get', '/api/users')

export const useUsers = () => $queryClient.useQuery('get', '/api/users')

export const useSuspenseUsers = () => useSuspenseQuery(usersQueryOptions())
