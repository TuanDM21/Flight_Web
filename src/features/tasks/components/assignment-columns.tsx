import { z } from 'zod'
import { format } from 'date-fns'
import { UseFormReturn, useWatch } from 'react-hook-form'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'
import {
  IconDeviceFloppy,
  IconEdit,
  IconTrash,
  IconX,
} from '@tabler/icons-react'
import { dateFormatPatterns } from '@/config/date'
import { FileTextIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/auth-context'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { FormFieldTooltipError } from '@/components/form-field-tooltip-error'
import { useRecipientOptions } from '@/features/tasks/hooks/use-recipient-options'
import { updateTaskAssignmentSchema } from '@/features/tasks/schema'
import {
  Task,
  TaskAssignment,
  TaskAssignmentStatus,
} from '@/features/tasks/types'
import {
  assigneeTaskAssignmentStatusLabels,
  ownerTaskAssignmentStatusLabels,
  taskAssignmentsStatusIcons,
  taskAssignmentStatusVariants,
  taskStatusLabels,
} from '@/features/tasks/utils/tasks'
import { EditableNoteCell } from './editable-note-cell'

type TaskAssignmentUpdateForm = z.infer<typeof updateTaskAssignmentSchema> & {
  assignmentId?: number
}

interface AssignmentColumnsProps {
  editingAssignmentId: number | undefined
  form: UseFormReturn<TaskAssignmentUpdateForm>
  handleSaveEdit: () => Promise<void>
  resetAssignmentForm: () => void
  handleUpdateAssignmentStatus: (
    assignment: TaskAssignment,
    newStatus: TaskAssignmentStatus
  ) => void
  handleOpenCommentsSheet: (assignment: TaskAssignment) => void
  startEditing: (assignment: TaskAssignment) => void
  handleDeleteAssignment: (assignment: TaskAssignment) => void
  updateAssignmentMutation: { isPending: boolean }

  task: Task
}

export function useCreateAssignmentColumns({
  editingAssignmentId,
  form,
  handleSaveEdit,
  resetAssignmentForm,
  handleUpdateAssignmentStatus,
  handleOpenCommentsSheet,
  startEditing,
  handleDeleteAssignment,
  updateAssignmentMutation,
  task,
}: AssignmentColumnsProps): ColumnDef<TaskAssignment>[] {
  const { user } = useAuth()

  const isTaskOwner = user?.id === task.createdByUser?.id
  const { getRecipientOptions, deriveRecipientOptions } = useRecipientOptions()

  const currentRecipientType = useWatch({
    control: form.control,
    name: 'recipientType',
  })

  const taskAssignmentStatusLabels = isTaskOwner
    ? ownerTaskAssignmentStatusLabels
    : assigneeTaskAssignmentStatusLabels

  return [
    {
      id: 'recipientType',
      accessorKey: 'recipientType',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Type' />
      ),
      cell: ({ row, cell }) => {
        const assignment = row.original
        const isEditing = editingAssignmentId === assignment.assignmentId
        const value = cell.getValue<string>()

        if (isEditing) {
          return (
            <FormField
              control={form.control}
              name='recipientType'
              render={({ field, fieldState }) => (
                <FormItem className='flex flex-col'>
                  <FormControl>
                    <FormFieldTooltipError
                      message={fieldState.error?.message || ''}
                      showError={!!fieldState.error}
                    >
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value)
                          form.setValue('recipientId', null as any, {
                            shouldValidate: false,
                          })
                        }}
                      >
                        <SelectTrigger
                          className={cn(
                            'w-full',
                            fieldState.error && 'border-destructive'
                          )}
                        >
                          <SelectValue placeholder='Select type' />
                        </SelectTrigger>
                        <SelectContent>
                          {deriveRecipientOptions.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormFieldTooltipError>
                  </FormControl>
                </FormItem>
              )}
            />
          )
        }
        return <div>{value || 'N/A'}</div>
      },
      size: 100,
      enableSorting: false,
    },
    {
      id: 'recipientUser',
      accessorKey: 'recipientUser',
      accessorFn: (row) => {
        if (row.recipientType === 'user') {
          return row.recipientUser?.name ?? ''
        }
        if (row.recipientType === 'team') {
          return row.recipientUser?.teamName ?? ''
        }
        if (row.recipientType === 'unit') {
          return row.recipientUser?.unitName ?? ''
        }
        return 'N/A'
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Recipient' />
      ),
      cell: ({ row, cell }) => {
        const assignment = row.original
        const isEditing = editingAssignmentId === assignment.assignmentId
        const value = cell.getValue<string>()

        if (isEditing) {
          return (
            <FormField
              control={form.control}
              name='recipientId'
              render={({ field, fieldState }) => {
                return (
                  <FormItem className='flex flex-col'>
                    <FormControl>
                      <Select
                        value={field.value ? String(field.value) : ''}
                        onValueChange={(value) => field.onChange(Number(value))}
                        disabled={!currentRecipientType}
                      >
                        <FormFieldTooltipError
                          message={fieldState.error?.message || ''}
                          showError={!!fieldState.error}
                        >
                          <SelectTrigger
                            className={cn(
                              'w-full',
                              fieldState.error && 'border-destructive'
                            )}
                          >
                            <SelectValue placeholder='Select recipient' />
                          </SelectTrigger>
                        </FormFieldTooltipError>
                        <SelectContent>
                          {(() => {
                            const options = getRecipientOptions(
                              currentRecipientType || ''
                            )
                            if (options.length === 0) {
                              return (
                                <div className='text-muted-foreground p-2 text-sm'>
                                  No recipients available
                                </div>
                              )
                            }

                            return options.map((recipient) => (
                              <SelectItem
                                key={recipient.value}
                                value={String(recipient.value)}
                              >
                                {recipient.label}
                              </SelectItem>
                            ))
                          })()}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )
              }}
            />
          )
        }
        return <div>{value || 'N/A'}</div>
      },
      size: 100,
      enableSorting: false,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }) => {
        const assignment = row.original
        const isEditing = editingAssignmentId === assignment.assignmentId

        if (isEditing) {
          return (
            <FormField
              control={form.control}
              name='status'
              render={({ field, fieldState }) => (
                <FormItem className='flex flex-col'>
                  <FormControl>
                    <FormFieldTooltipError
                      message={fieldState.error?.message || ''}
                      showError={!!fieldState.error}
                    >
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger
                          className={cn(
                            'w-full',
                            fieldState.error && 'border-destructive'
                          )}
                        >
                          <SelectValue placeholder='Select status' />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(taskAssignmentStatusLabels).map(
                            ([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </FormFieldTooltipError>
                  </FormControl>
                </FormItem>
              )}
            />
          )
        }
        const status = assignment.status || 'ASSIGNED'
        const Icon = taskAssignmentsStatusIcons[status]
        const label = taskStatusLabels[status]
        const variant = taskAssignmentStatusVariants[status]
        return (
          <Badge variant={variant}>
            <Icon className='size-4' />
            {label}
          </Badge>
        )
      },
      size: 120,
      enableSorting: false,
    },
    {
      id: 'assignedByUser',
      accessorKey: 'assignedByUser',
      accessorFn: (row) => row.assignedByUser?.name ?? '',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Assigned By' />
      ),
      cell: ({ cell }) => <div>{cell.getValue<string>() || 'N/A'}</div>,
      size: 100,
      enableSorting: false,
    },
    {
      id: 'assignedAt',
      accessorKey: 'assignedAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Assigned At' />
      ),
      cell: ({ cell }) => {
        const value = cell.getValue<string>()
        if (!value) return <div>Not set</div>
        const date = new Date(value)
        return <div>{format(date, dateFormatPatterns.fullDateTime)}</div>
      },
      enableSorting: false,
    },
    {
      id: 'dueAt',
      accessorKey: 'dueAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Due At' />
      ),
      cell: ({ row, cell }) => {
        const assignment = row.original
        const isEditing = editingAssignmentId === assignment.assignmentId
        const value = cell.getValue<string | null>()
        if (isEditing) {
          return (
            <FormField
              control={form.control}
              name='dueAt'
              render={({ field, fieldState }) => (
                <FormItem className='flex flex-col'>
                  <FormControl>
                    <FormFieldTooltipError
                      message={fieldState.error?.message || ''}
                      showError={!!fieldState.error}
                    >
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant='outline'
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              form.formState.errors.dueAt &&
                                'border-destructive'
                            )}
                          >
                            {field.value ? (
                              format(
                                new Date(field.value),
                                dateFormatPatterns.shortDateTime
                              )
                            ) : (
                              <span className='text-muted-foreground'>
                                Pick a date
                              </span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) =>
                              field.onChange(
                                date ? date.toISOString() : undefined
                              )
                            }
                            initialFocus
                            disabled={(date) => date < new Date()}
                            className='rounded-md border'
                          />
                        </PopoverContent>
                      </Popover>
                    </FormFieldTooltipError>
                  </FormControl>
                </FormItem>
              )}
            />
          )
        }
        if (!value) return <div>Not set</div>
        const date = new Date(value)
        return <div>{format(date, dateFormatPatterns.fullDateTime)}</div>
      },
      enableSorting: false,
    },
    {
      id: 'note',
      accessorKey: 'note',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Note' />
      ),
      cell: ({ row }) => {
        const assignment = row.original
        return (
          <EditableNoteCell
            assignment={assignment}
            assignmentId={editingAssignmentId!}
            form={form}
          />
        )
      },
      size: 200,
      enableSorting: false,
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Actions' />
      ),
      cell: ({ row }) => {
        const assignment = row.original
        const isEditing = editingAssignmentId === assignment.assignmentId
        const isAssignedToCurrentUser =
          user?.id === assignment.recipientUser?.id

        if (isEditing) {
          return (
            <div className='flex space-x-2'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={handleSaveEdit}
                    disabled={updateAssignmentMutation.isPending}
                  >
                    <IconDeviceFloppy className='h-4 w-4' />
                    <span className='sr-only'>Save changes</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save changes</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={resetAssignmentForm}
                  >
                    <IconX className='h-4 w-4' />
                    <span className='sr-only'>Cancel edit</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Cancel edit</TooltipContent>
              </Tooltip>
            </div>
          )
        }
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
              >
                <DotsHorizontalIcon className='h-4 w-4' />
                <span className='sr-only'>Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[160px]'>
              {(isAssignedToCurrentUser || isTaskOwner) && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup value={String(assignment.status)}>
                      {Object.entries(taskAssignmentStatusLabels).map(
                        ([value, label]) => {
                          const correctValue = value as TaskAssignmentStatus
                          return (
                            <DropdownMenuRadioItem
                              key={value}
                              value={value}
                              disabled={value === String(assignment.status)}
                              onClick={() =>
                                handleUpdateAssignmentStatus(
                                  assignment,
                                  correctValue
                                )
                              }
                            >
                              {label}
                            </DropdownMenuRadioItem>
                          )
                        }
                      )}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              )}
              <DropdownMenuItem
                onClick={() => handleOpenCommentsSheet(assignment)}
              >
                View comments
                <DropdownMenuShortcut>
                  <FileTextIcon />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              {isTaskOwner && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => startEditing(assignment)}>
                    Edit
                    <DropdownMenuShortcut>
                      <IconEdit />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteAssignment(assignment)}
                  >
                    Delete
                    <DropdownMenuShortcut>
                      <IconTrash />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      size: 20,
      meta: {
        className: 'sticky right-0 bg-background border-l',
      },
      enableSorting: false,
    },
  ]
}
