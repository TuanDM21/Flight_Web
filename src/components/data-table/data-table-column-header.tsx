'use client'

import type { Column } from '@tanstack/react-table'
import { ChevronDown, ChevronUp, ChevronsUpDown, EyeOff, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.ComponentProps<typeof DropdownMenuTrigger> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'hover:bg-accent focus:ring-ring data-[state=open]:bg-accent [&_svg]:text-muted-foreground -ml-1.5 flex h-8 items-center gap-1.5 rounded-md px-2 py-1.5 focus:ring-1 focus:outline-none [&_svg]:size-4 [&_svg]:shrink-0',
          className
        )}
        {...props}
      >
        {title}
        {column.getCanSort() &&
          (column.getIsSorted() === 'desc' ? (
            <ChevronDown />
          ) : column.getIsSorted() === 'asc' ? (
            <ChevronUp />
          ) : (
            <ChevronsUpDown />
          ))}
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-28'>
        {column.getCanSort() && (
          <>
            <DropdownMenuCheckboxItem
              className='[&_svg]:text-muted-foreground relative px-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto'
              checked={column.getIsSorted() === 'asc'}
              onClick={() => {
                column.toggleSorting(false)
              }}
            >
              <ChevronUp />
              Tăng dần
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              className='[&_svg]:text-muted-foreground relative px-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto'
              checked={column.getIsSorted() === 'desc'}
              onClick={() => {
                column.toggleSorting(true)
              }}
            >
              <ChevronDown />
              Giảm dần
            </DropdownMenuCheckboxItem>
            {column.getIsSorted() && (
              <DropdownMenuItem
                className='[&_svg]:text-muted-foreground pl-2'
                onClick={() => {
                  column.clearSorting()
                }}
              >
                <X />
                Đặt lại
              </DropdownMenuItem>
            )}
          </>
        )}
        {column.getCanHide() && (
          <DropdownMenuCheckboxItem
            className='[&_svg]:text-muted-foreground relative px-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto'
            checked={!column.getIsVisible()}
            onClick={() => {
              column.toggleVisibility(false)
            }}
          >
            <EyeOff />
            Ẩn
          </DropdownMenuCheckboxItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
