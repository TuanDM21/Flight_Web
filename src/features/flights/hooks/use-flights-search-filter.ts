import React from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { FlightsRoute } from '@/routes/_authenticated/flights'
import { parseAsString, useQueryState } from 'nuqs'
import { getValidFilters } from '@/lib/data-table'
import { sortColumns } from '@/lib/sort-columns'
import { Flight } from '../types'
import { flightSearchParamsCache } from '../utils/flights'
import { flightsQueryOptions } from './use-flights'

export function useFlightsSearchFilter() {
  const searchParams = FlightsRoute.useSearch()

  // Data fetching
  const { data: taskList } = useSuspenseQuery(flightsQueryOptions())

  // Query state management
  const [queryFilter, setQueryFilter] = useQueryState(
    'q',
    parseAsString.withDefault('')
  )

  // Parse search params
  const search = flightSearchParamsCache.parse(searchParams)
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
        const flightNumber = task.flightNumber?.toLowerCase() || ''
        const airline = task.airline?.toLowerCase() || ''

        return flightNumber.includes(searchTerm) || airline.includes(searchTerm)
      })
    }

    // Apply column filters using filterColumns
    // if (validFilters.length > 0) {
    //   const filterFn = filterColumns<FlightFilters>({
    //     filters: validFilters,
    //     joinOperator: 'or',
    //   })

    //   if (filterFn) {
    //     filteredTasks = filteredTasks.filter(filterFn)
    //   }
    // }

    // Apply sorting using sortColumns
    if (search.sort.length > 0) {
      filteredTasks = sortColumns<Flight>(filteredTasks, search.sort as any[])
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
