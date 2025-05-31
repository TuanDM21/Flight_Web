import React, { useState } from 'react'
import { z } from 'zod'
import { format } from 'date-fns'
import { useForm, UseFormReturn } from 'react-hook-form'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { ColumnDef } from '@tanstack/react-table'
import {
  IconDeviceFloppy,
  IconEdit,
  IconTrash,
  IconX,
} from '@tabler/icons-react'
import { dateFormatPatterns } from '@/config/date'
import { FileTextIcon, FileUser, Users } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useDataTable } from '@/hooks/use-data-table'
import { AppDialogInstance } from '@/hooks/use-dialog-instance'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { AppConfirmDialog } from '@/components/app-confirm-dialog'
import { AppDialog } from '@/components/app-dialog'
import { AppSheet } from '@/components/app-sheet'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { FormFieldTooltipError } from '@/components/form-field-tooltip-error'
import { useUpdateAssignmentMutation } from '@/features/tasks/hooks/use-update-assignment'
import { updateTaskAssignmentSchema } from '@/features/tasks/schema'
import { TaskAssignment, TaskAssignmentStatus } from '@/features/tasks/types'
import {
  taskStatusIcons,
  taskStatusLabels,
  taskStatusVariants,
} from '@/features/tasks/utils'
import { useCreateTaskAssignmentsMutation } from '../hooks/use-create-task-assignments'
import {
  RECIPIENT_TYPES,
  useRecipientOptions,
} from '../hooks/use-recipient-options'
import { useViewTaskAssignments } from '../hooks/use-view-task-assignments'
import DeleteTaskAssignmentConfirmDialog from './delete-task-assignment-confirm-dialog'
import { TaskAssignmentCommentsSheet } from './task-assignment-comments-sheet'
import { TaskAssignmentFormSheet } from './task-assignment-form-sheet'

interface EditableNoteCellProps {
  assignment: TaskAssignment
  assignmentId: number
  form: UseFormReturn<TaskAssignmentUpdateForm>
}

const EditableNoteCell = React.memo(
  ({ assignment, assignmentId, form }: EditableNoteCellProps) => {
    if (assignmentId === assignment.assignmentId) {
      return (
        <FormField
          control={form.control}
          name='note'
          render={({ field, fieldState }) => (
            <FormItem className='flex flex-col'>
              <FormControl>
                <FormFieldTooltipError
                  message={fieldState.error?.message || ''}
                  showError={!!fieldState.error}
                >
                  <Textarea
                    {...field}
                    placeholder='Add a note'
                    className={cn(
                      'max-w-[200px] text-sm',
                      fieldState.error && 'border-destructive'
                    )}
                  />
                </FormFieldTooltipError>
              </FormControl>
            </FormItem>
          )}
        />
      )
    }
    return <div>{assignment.note || 'No notes'}</div>
  }
)

type TaskAssignmentUpdateForm = z.infer<typeof updateTaskAssignmentSchema> & {
  assignmentId?: number
}

interface ViewAssignmentDialogContentProps {
  taskId: number
  dialog: AppDialogInstance
}

const initialFormValues: TaskAssignmentUpdateForm = {
  recipientType: '',
  recipientId: 0,
  status: 'ASSIGNED',
  note: '',
  dueAt: new Date().toISOString(),
}

export function ViewAssignmentDialog({
  taskId,
  dialog,
}: ViewAssignmentDialogContentProps) {
  const updateAssignmentMutation = useUpdateAssignmentMutation(taskId)

  const { data: assignments, isLoading: isLoadingAssignments } =
    useViewTaskAssignments(taskId)

  const [selectedAssignment, setSelectedAssignment] =
    useState<TaskAssignment | null>(null)
  const [commentsAssignment, setCommentsAssignment] =
    useState<TaskAssignment | null>(null)

  const form = useForm<TaskAssignmentUpdateForm>({
    resolver: zodResolver(updateTaskAssignmentSchema),
    defaultValues: initialFormValues,
  })

  const editingAssignmentId = form.watch('assignmentId')

  const { getRecipientOptions } = useRecipientOptions()

  const resetAssignmentForm = () => {
    form.reset({
      assignmentId: undefined,
      ...initialFormValues,
    })
  }

  const startEditing = (assignment: TaskAssignment) => {
    form.reset({
      recipientType: assignment.recipientType || '',
      recipientId: assignment.recipientId || 0,
      status: assignment.status ?? 'ASSIGNED',
      note: assignment.note || '',
      dueAt: assignment.dueAt || '',
      assignmentId: assignment.assignmentId,
    })
  }

  const handleSaveEdit = async () => {
    const { assignmentId, ...restValues } = form.getValues()

    if (!assignmentId) {
      toast.error('Assignment ID is missing.')
      return
    }

    const isValid = await form.trigger()
    if (!isValid) return

    const updatePromise = updateAssignmentMutation.mutateAsync({
      params: {
        path: { id: assignmentId },
      },
      body: restValues,
    })
    toast.promise(updatePromise, {
      loading: 'Updating assignment...',
      success: () => {
        resetAssignmentForm()
        return 'Assignment updated successfully!'
      },
      error: 'Failed to update assignment. Please try again.',
    })
  }

  const handleUpdateAssignmentStatus = (
    assignment: TaskAssignment,
    newStatus: TaskAssignmentStatus
  ) => {
    const updatePromise = updateAssignmentMutation.mutateAsync({
      params: {
        path: { id: assignment.assignmentId || 0 },
      },
      body: {
        status: newStatus,
      },
    })
    toast.promise(updatePromise, {
      loading: `Updating assignment status...`,
      success: `Assignment status updated to ${taskStatusLabels[newStatus]}!`,
      error: `Failed to update assignment status. Please try again.`,
    })
  }

  const assignmentColumns: ColumnDef<TaskAssignment>[] = [
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
                          form.setValue('recipientId', null as any)
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
                          {RECIPIENT_TYPES.map((type) => (
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
        return <div className='capitalize'>{value || 'N/A'}</div>
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
              render={({ field, fieldState }) => (
                <FormItem className='flex flex-col'>
                  <FormControl>
                    <Select
                      value={String(field.value || '')}
                      onValueChange={(value) => field.onChange(Number(value))}
                      disabled={!form.getValues('recipientType')}
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
                        {getRecipientOptions(
                          form.getValues('recipientType') || ''
                        ).map((recipient) => (
                          <SelectItem
                            key={recipient.value}
                            value={String(recipient.value)}
                          >
                            {recipient.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                          {Object.entries(taskStatusLabels).map(
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
        const Icon = taskStatusIcons[status]
        const label = taskStatusLabels[status]
        const variant = taskStatusVariants[status]
        return (
          <Badge
            className='flex items-center gap-1 capitalize'
            variant={variant}
          >
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
      cell: ({ cell }) => <div>{cell.getValue<number>() || 'N/A'}</div>,
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
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup value={String(assignment.status)}>
                    {Object.entries(taskStatusLabels).map(([value, label]) => {
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
                    })}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem
                onClick={() => {
                  setCommentsAssignment(assignment)
                  commentsSheetDialogInstance.open()
                }}
              >
                View comments
                <DropdownMenuShortcut>
                  <FileTextIcon />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
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
  const { table: assignmentsTable } = useDataTable({
    data: assignments?.data ?? [],
    columns: assignmentColumns,
    pageCount: 1,
  })

  const deleteAssignmentDialogInstance = AppConfirmDialog.useDialog()
  const commentsSheetDialogInstance = AppSheet.useDialog()
  const createAssignmentSheetDialogInstance = AppSheet.useDialog()

  const taskAssignmentsMutation = useCreateTaskAssignmentsMutation()

  const noAssignments = !assignments?.data || assignments.data.length === 0

  const handleDeleteAssignment = (assignment: TaskAssignment) => {
    setSelectedAssignment(assignment)
    deleteAssignmentDialogInstance.open()
  }

  const handleOpenCreateAssignmentSheet = () => {
    createAssignmentSheetDialogInstance.open()
  }

  return (
    <>
      {selectedAssignment && (
        <DeleteTaskAssignmentConfirmDialog
          taskId={taskId}
          assignment={selectedAssignment}
          onSuccess={() => {
            setSelectedAssignment(null)
          }}
          dialog={deleteAssignmentDialogInstance}
        />
      )}

      {commentsAssignment && commentsSheetDialogInstance.isOpen && (
        <TaskAssignmentCommentsSheet
          assignmentId={commentsAssignment.assignmentId!}
          dialog={commentsSheetDialogInstance}
        />
      )}

      {createAssignmentSheetDialogInstance.isOpen && (
        <TaskAssignmentFormSheet
          taskId={taskId}
          dialog={createAssignmentSheetDialogInstance}
        />
      )}

      <AppDialog dialog={dialog}>
        <DialogContent
          className='max-h-7xl flex flex-col sm:max-w-7xl'
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(event) => event.preventDefault()}
        >
          <DialogHeader className='pb-4'>
            <DialogTitle>Assignments for Task #{taskId}</DialogTitle>
            <p className='text-muted-foreground mt-1 text-sm'>
              View all assignments for this task
            </p>
          </DialogHeader>

          <div className='flex justify-end gap-2'>
            {!noAssignments && (
              <Button
                className='space-x-1'
                onClick={handleOpenCreateAssignmentSheet}
              >
                <span>Create Assignment</span> <FileUser />
              </Button>
            )}
          </div>
          <Form {...form}>
            {isLoadingAssignments || taskAssignmentsMutation.isPending ? (
              <DataTableSkeleton
                columnCount={5}
                rowCount={5}
                withViewOptions={false}
              />
            ) : noAssignments ? (
              <div className='flex h-full flex-col items-center justify-center space-y-4 py-8'>
                <div className='bg-muted rounded-full p-4'>
                  <Users className='text-muted-foreground h-8 w-8' />
                </div>
                <div className='space-y-2 text-center'>
                  <h3 className='text-muted-foreground text-lg font-medium'>
                    No assignments yet
                  </h3>
                  <Button
                    className='space-x-1'
                    onClick={handleOpenCreateAssignmentSheet}
                  >
                    <span>Create Assignment</span> <FileUser />
                  </Button>
                  <p className='text-muted-foreground max-w-sm text-sm'>
                    Be the first to create an assignment for this task.
                  </p>
                </div>
              </div>
            ) : (
              <DataTable table={assignmentsTable} />
            )}
          </Form>
        </DialogContent>
      </AppDialog>
    </>
  )
}
