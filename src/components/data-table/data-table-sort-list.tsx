'use client'

import * as React from 'react'
import type { ColumnSort, SortDirection, Table } from '@tanstack/react-table'
import { dataTableConfig } from '@/config/data-table'
import { ArrowDownUp, ChevronsUpDown, GripVertical, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from '@/components/ui/sortable'

const REMOVE_SORT_SHORTCUTS = new Set(['backspace', 'delete'])

interface DataTableSortListProps<TData>
  extends React.ComponentProps<typeof PopoverContent> {
  table: Table<TData>
}

export function DataTableSortList<TData>({
  table,
  ...props
}: DataTableSortListProps<TData>) {
  const id = React.useId()
  const labelId = React.useId()
  const descriptionId = React.useId()
  const [open, setOpen] = React.useState(false)
  const addButtonRef = React.useRef<HTMLButtonElement>(null)

  const sorting = table.getState().sorting
  const onSortingChange = table.setSorting

  const { columnLabels, columns } = React.useMemo(() => {
    const labels = new Map<string, string>()
    const sortingIds = new Set(sorting.map((s) => s.id))
    const availableColumns: { id: string; label: string }[] = []

    for (const column of table.getAllColumns()) {
      if (!column.getCanSort()) continue

      const label = column.columnDef.meta?.label ?? column.id
      labels.set(column.id, label)

      if (!sortingIds.has(column.id)) {
        availableColumns.push({ id: column.id, label })
      }
    }

    return {
      columnLabels: labels,
      columns: availableColumns,
    }
  }, [sorting, table])

  const onSortAdd = React.useCallback(() => {
    const firstColumn = columns[0]
    if (!firstColumn) return

    onSortingChange((prevSorting) => [
      ...prevSorting,
      { id: firstColumn.id, desc: false },
    ])
  }, [columns, onSortingChange])

  const onSortUpdate = React.useCallback(
    (sortId: string, updates: Partial<ColumnSort>) => {
      onSortingChange((prevSorting) => {
        if (!prevSorting) return prevSorting
        return prevSorting.map((sort) =>
          sort.id === sortId ? { ...sort, ...updates } : sort
        )
      })
    },
    [onSortingChange]
  )

  const onSortRemove = React.useCallback(
    (sortId: string) => {
      onSortingChange((prevSorting) =>
        prevSorting.filter((item) => item.id !== sortId)
      )
    },
    [onSortingChange]
  )

  const onSortingReset = React.useCallback(() => {
    onSortingChange(table.initialState.sorting)
  }, [onSortingChange, table.initialState.sorting])

  const onTriggerKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (
        REMOVE_SORT_SHORTCUTS.has(event.key.toLowerCase()) &&
        sorting.length > 0
      ) {
        event.preventDefault()
        onSortingReset()
      }
    },
    [sorting.length, onSortingReset]
  )

  return (
    <Sortable
      value={sorting}
      onValueChange={onSortingChange}
      getItemValue={(item) => item.id}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant='outline' size='sm' onKeyDown={onTriggerKeyDown}>
            <ArrowDownUp />
            Sắp xếp
            {sorting.length > 0 && (
              <Badge
                variant='secondary'
                className='h-[18.24px] rounded-[3.2px] px-[5.12px] font-mono text-[10.4px] font-normal'
              >
                {sorting.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          aria-labelledby={labelId}
          aria-describedby={descriptionId}
          className='flex w-full max-w-[var(--radix-popover-content-available-width)] origin-[var(--radix-popover-content-transform-origin)] flex-col gap-3.5 p-4 sm:min-w-[380px]'
          {...props}
        >
          <div className='flex flex-col gap-1'>
            <h4 id={labelId} className='leading-none font-medium'>
              {sorting.length > 0 ? 'Sắp xếp theo' : 'Chưa áp dụng sắp xếp'}
            </h4>
            <p
              id={descriptionId}
              className={cn(
                'text-muted-foreground text-sm',
                sorting.length > 0 && 'sr-only'
              )}
            >
              {sorting.length > 0
                ? 'Chỉnh sửa sắp xếp để tổ chức các hàng của bạn.'
                : 'Thêm sắp xếp để tổ chức các hàng của bạn.'}
            </p>
          </div>
          {sorting.length > 0 && (
            <SortableContent asChild>
              <div
                role='list'
                className='flex max-h-[300px] flex-col gap-2 overflow-y-auto p-1'
              >
                {sorting.map((sort) => (
                  <DataTableSortItem
                    key={sort.id}
                    sort={sort}
                    sortItemId={`${id}-sort-${sort.id}`}
                    columns={columns}
                    columnLabels={columnLabels}
                    onSortUpdate={onSortUpdate}
                    onSortRemove={onSortRemove}
                  />
                ))}
              </div>
            </SortableContent>
          )}
          <div className='flex w-full items-center gap-2'>
            <Button
              size='sm'
              className='rounded'
              ref={addButtonRef}
              onClick={onSortAdd}
              disabled={columns.length === 0}
            >
              Thêm sắp xếp
            </Button>
            {sorting.length > 0 && (
              <Button
                variant='outline'
                size='sm'
                className='rounded'
                onClick={onSortingReset}
              >
                Đặt lại sắp xếp
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
      <SortableOverlay>
        <div className='flex items-center gap-2'>
          <div className='bg-primary/10 h-8 w-[180px] rounded-sm' />
          <div className='bg-primary/10 h-8 w-32 rounded-sm' />
          <div className='bg-primary/10 size-8 shrink-0 rounded-sm' />
          <div className='bg-primary/10 size-8 shrink-0 rounded-sm' />
        </div>
      </SortableOverlay>
    </Sortable>
  )
}

interface DataTableSortItemProps {
  sort: ColumnSort
  sortItemId: string
  columns: { id: string; label: string }[]
  columnLabels: Map<string, string>
  onSortUpdate: (sortId: string, updates: Partial<ColumnSort>) => void
  onSortRemove: (sortId: string) => void
}

function DataTableSortItem({
  sort,
  sortItemId,
  columns,
  columnLabels,
  onSortUpdate,
  onSortRemove,
}: DataTableSortItemProps) {
  const fieldListboxId = `${sortItemId}-field-listbox`
  const fieldTriggerId = `${sortItemId}-field-trigger`
  const directionListboxId = `${sortItemId}-direction-listbox`

  const [showFieldSelector, setShowFieldSelector] = React.useState(false)
  const [showDirectionSelector, setShowDirectionSelector] =
    React.useState(false)

  const onItemKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      if (showFieldSelector || showDirectionSelector) {
        return
      }

      if (REMOVE_SORT_SHORTCUTS.has(event.key.toLowerCase())) {
        event.preventDefault()
        onSortRemove(sort.id)
      }
    },
    [sort.id, showFieldSelector, showDirectionSelector, onSortRemove]
  )

  return (
    <SortableItem value={sort.id} asChild>
      <div
        role='listitem'
        id={sortItemId}
        tabIndex={-1}
        className='flex items-center gap-2'
        onKeyDown={onItemKeyDown}
      >
        <Popover open={showFieldSelector} onOpenChange={setShowFieldSelector}>
          <PopoverTrigger asChild>
            <Button
              id={fieldTriggerId}
              role='combobox'
              aria-controls={fieldListboxId}
              variant='outline'
              size='sm'
              className='w-44 justify-between rounded font-normal'
            >
              <span className='truncate'>{columnLabels.get(sort.id)}</span>
              <ChevronsUpDown className='opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            id={fieldListboxId}
            className='w-[var(--radix-popover-trigger-width)] origin-[var(--radix-popover-content-transform-origin)] p-0'
          >
            <Command>
              <CommandInput placeholder='Tìm kiếm trường...' />
              <CommandList>
                <CommandEmpty>Không tìm thấy trường.</CommandEmpty>
                <CommandGroup>
                  {columns.map((column) => (
                    <CommandItem
                      key={column.id}
                      value={column.id}
                      onSelect={(value) => {
                        onSortUpdate(sort.id, { id: value })
                      }}
                    >
                      <span className='truncate'>{column.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Select
          open={showDirectionSelector}
          onOpenChange={setShowDirectionSelector}
          value={sort.desc ? 'desc' : 'asc'}
          onValueChange={(value: SortDirection) => {
            onSortUpdate(sort.id, { desc: value === 'desc' })
          }}
        >
          <SelectTrigger
            aria-controls={directionListboxId}
            className='h-8 w-28 rounded [&[data-size]]:h-8'
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            id={directionListboxId}
            className='min-w-[var(--radix-select-trigger-width)] origin-[var(--radix-select-content-transform-origin)]'
          >
            {dataTableConfig.sortOrders.map((order) => (
              <SelectItem key={order.value} value={order.value}>
                {order.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          aria-controls={sortItemId}
          variant='outline'
          size='icon'
          className='size-8 shrink-0 rounded'
          onClick={() => {
            onSortRemove(sort.id)
          }}
        >
          <Trash2 />
        </Button>
        <SortableItemHandle asChild>
          <Button
            variant='outline'
            size='icon'
            className='size-8 shrink-0 rounded'
          >
            <GripVertical />
          </Button>
        </SortableItemHandle>
      </div>
    </SortableItem>
  )
}
