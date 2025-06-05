import $queryClient from '@/api'
import { TaskFilterTypes } from '../types'

export const tasksQueryOptions = (filterType: TaskFilterTypes) =>
  $queryClient.queryOptions('get', '/api/tasks/my', {
    params: {
      query: {
        type: filterType,
      },
    },
  })

export const useTasks = (filterType: TaskFilterTypes) =>
  $queryClient.queryOptions('get', '/api/tasks/my', {
    params: {
      query: {
        type: filterType,
      },
    },
  })
