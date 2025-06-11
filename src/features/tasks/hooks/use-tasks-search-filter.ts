import * as React from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { TasksRoute } from '@/routes/_authenticated/tasks'
import { parseAsString, useQueryState } from 'nuqs'
import { getValidFilters } from '@/lib/data-table'
import { filterColumns } from '@/lib/filter-columns'
import { sortColumns } from '@/lib/sort-columns'
import { Task, TaskFilters } from '@/features/tasks/types'
import { taskSearchParamsCache } from '../utils/tasks'
import { tasksQueryOptions } from './use-tasks'

export function useTasksSearchFilter() {
  const searchParams = TasksRoute.useSearch()
  const currentType = searchParams.type || 'assigned'

  // Data fetching
  const { data: taskList } = useSuspenseQuery(tasksQueryOptions(currentType))

  // Query state management
  const [queryFilter, setQueryFilter] = useQueryState(
    'q',
    parseAsString.withDefault('')
  )

  // Parse search params
  const search = taskSearchParamsCache.parse(searchParams)
  const tasks = taskList.data ?? []

  const validFilters = getValidFilters(search.filters as any[])
  const isFiltering = Boolean(queryFilter) || validFilters.length > 0

  const filteredData = React.useMemo(() => {
    // Text search filter
    let filteredTasks = tasks
    if (queryFilter) {
      const searchTerm = String(queryFilter).toLowerCase()
      filteredTasks = tasks.filter((task) => {
        // Search in multiple fields - adjust as needed for your data structure
        const content = (task.content || '').toLowerCase()
        const createdBy = (task.createdByUser?.name ?? '')
          ?.toString()
          .toLowerCase()

        return content.includes(searchTerm) || createdBy.includes(searchTerm)
      })
    }

    // Apply column filters using filterColumns
    if (validFilters.length > 0) {
      const filterFn = filterColumns<TaskFilters>({
        filters: validFilters,
        joinOperator: 'or',
      })

      if (filterFn) {
        filteredTasks = filteredTasks.filter(filterFn)
      }
    }

    // Apply sorting using sortColumns
    if (search.sort.length > 0) {
      filteredTasks = sortColumns<Task>(filteredTasks, search.sort as any[])
    }

    return filteredTasks
  }, [tasks, queryFilter, validFilters, search.sort])

  return {
    filteredData,
    isFiltering,
    validFilters,
    queryFilter,
    setQueryFilter,
  }
}
