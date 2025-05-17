import type { Column } from '@tanstack/react-table'
import { dataTableConfig } from '@/config/data-table'
import type {
  ExtendedColumnFilter,
  FilterOperator,
  FilterVariant,
} from '@/types/data-table'

export function getCommonPinningStyles<TData>({
  column,
  withBorder = false,
}: {
  column: Column<TData>
  withBorder?: boolean
}): React.CSSProperties {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right')

  return {
    boxShadow:
      withBorder || isPinned
        ? isLastLeftPinnedColumn
          ? '4px 0 8px -2px rgba(0, 0, 0, 0.15)'
          : isFirstRightPinnedColumn
            ? '-4px 0 8px -2px rgba(0, 0, 0, 0.15)'
            : isPinned === 'left'
              ? '2px 0 4px -2px rgba(0, 0, 0, 0.1)'
              : isPinned === 'right'
                ? '-2px 0 4px -2px rgba(0, 0, 0, 0.1)'
                : undefined
        : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: isPinned ? 1 : 1,
    position: isPinned ? 'sticky' : 'relative',
    background: isPinned ? 'hsl(var(--background))' : 'hsl(var(--background))',
    backdropFilter: isPinned ? 'blur(4px)' : undefined,
    width: column.getSize(),
    zIndex: isPinned ? 2 : 0,
  }
}

export function getFilterOperators(filterVariant: FilterVariant) {
  const operatorMap: Record<
    FilterVariant,
    { label: string; value: FilterOperator }[]
  > = {
    text: dataTableConfig.textOperators,
    number: dataTableConfig.numericOperators,
    range: dataTableConfig.numericOperators,
    date: dataTableConfig.dateOperators,
    dateRange: dataTableConfig.dateOperators,
    boolean: dataTableConfig.booleanOperators,
    select: dataTableConfig.selectOperators,
    multiSelect: dataTableConfig.multiSelectOperators,
  }

  return operatorMap[filterVariant] ?? dataTableConfig.textOperators
}

export function getDefaultFilterOperator(filterVariant: FilterVariant) {
  const operators = getFilterOperators(filterVariant)

  return operators[0]?.value ?? (filterVariant === 'text' ? 'iLike' : 'eq')
}

export function getValidFilters<TData>(
  filters: ExtendedColumnFilter<TData>[]
): ExtendedColumnFilter<TData>[] {
  return filters.filter(
    (filter) =>
      filter.operator === 'isEmpty' ||
      filter.operator === 'isNotEmpty' ||
      (Array.isArray(filter.value)
        ? filter.value.length > 0
        : filter.value !== '' &&
          filter.value !== null &&
          filter.value !== undefined)
  )
}
