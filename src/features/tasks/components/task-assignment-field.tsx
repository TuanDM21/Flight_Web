import { format } from 'date-fns'
import {
  useFieldArray,
  useWatch,
  UseFormReturn,
  FieldValues,
  Path,
  ArrayPath,
} from 'react-hook-form'
import { dateFormatPatterns } from '@/config/date'
import { CalendarIcon, PlusCircle, UserIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
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
import { useRecipientOptions } from '../hooks/use-recipient-options'

type TaskAssignmentFieldProps<T extends FieldValues = FieldValues> = {
  form: UseFormReturn<T>
  name: ArrayPath<T>
}

export function TaskAssignmentField<T extends FieldValues = FieldValues>({
  form,
  name,
}: TaskAssignmentFieldProps<T>) {
  const { getRecipientOptions, deriveRecipientOptions } = useRecipientOptions()

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: name as ArrayPath<T>,
  })

  const assignmentValues = useWatch({
    control: form.control,
    name: name as Path<T>,
  })

  const handleAddAssignment = () => {
    append({
      recipientId: null,
      recipientType: '',
      dueAt: null,
      note: '',
    } as any)
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <FormLabel className='text-base font-medium'>Assignments</FormLabel>
      </div>

      {fields.length === 0 && (
        <Card className='border-dashed'>
          <CardContent className='flex flex-col items-center justify-center py-6'>
            <UserIcon className='text-muted-foreground h-8 w-8' />
            <p className='text-muted-foreground mt-2 text-sm'>
              No assignments added yet
            </p>
            <Button
              type='button'
              variant='secondary'
              onClick={handleAddAssignment}
              className='mt-4'
            >
              Add your first assignment
            </Button>
          </CardContent>
        </Card>
      )}

      {fields.map((field, index) => (
        <Card key={field.id} className='relative'>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='absolute top-2 right-2'
            onClick={() => {
              remove(index)
            }}
          >
            <X className='h-4 w-4' />
            <span className='sr-only'>Remove assignment</span>
          </Button>

          <CardContent className='pt-6'>
            <div className='grid grid-cols-1 items-start gap-4 sm:grid-cols-2 md:grid-cols-3'>
              <FormField
                control={form.control}
                name={`${name}.${index}.recipientType` as Path<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Type</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        form.setValue(
                          `${name}.${index}.recipientId` as Path<T>,
                          null as any,
                          {
                            shouldDirty: true,
                            shouldTouch: false,
                            shouldValidate: false,
                          }
                        )
                      }}
                      value={field.value}
                    >
                      <FormControl className='w-full'>
                        <SelectTrigger className='min-w-0 truncate'>
                          <SelectValue placeholder='Select recipient type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {deriveRecipientOptions.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`${name}.${index}.recipientId` as Path<T>}
                render={({ field }) => {
                  const currentRecipientType = useWatch({
                    control: form.control,
                    name: `${name}.${index}.recipientType` as Path<T>,
                  })

                  return (
                    <FormItem>
                      <FormLabel>Recipient</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(Number(value))
                        }}
                        value={field.value ? String(field.value) : ''}
                        disabled={!currentRecipientType}
                      >
                        <FormControl className='w-full'>
                          <SelectTrigger className='min-w-0 truncate'>
                            <SelectValue placeholder='Select recipient' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(() => {
                            const options = getRecipientOptions(
                              currentRecipientType || ''
                            )
                            if (options.length === 0) {
                              return (
                                <div className='text-muted-foreground px-2 py-1.5 text-sm'>
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
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />

              <FormField
                control={form.control}
                name={`${name}.${index}.dueAt` as Path<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl className='w-full'>
                          <Button
                            variant='outline'
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              <span className='flex w-full items-center justify-between'>
                                {' '}
                                {format(
                                  new Date(field.value),
                                  dateFormatPatterns.fullDate
                                )}
                              </span>
                            ) : (
                              <span>Select due date</span>
                            )}
                            <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='w-auto p-0' align='start'>
                        <Calendar
                          mode='single'
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            field.onChange(
                              date ? date.toISOString() : undefined
                            )
                          }}
                          disabled={(date) => date < new Date()}
                          className='rounded-md border'
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name={`${name}.${index}.note` as Path<T>}
              render={({ field }) => (
                <FormItem className='mt-4'>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Add any notes about this assignment'
                      className='min-h-32 resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {assignmentValues?.[index]?.recipientId &&
              assignmentValues?.[index]?.recipientType && (
                <div className='mt-4'>
                  <Badge
                    variant='outline'
                    className='border-dashed p-2 text-xs'
                  >
                    {(() => {
                      const recipientTypeName = deriveRecipientOptions.find(
                        (t) =>
                          t.value === assignmentValues?.[index]?.recipientType
                      )?.label
                      const recipientType =
                        assignmentValues?.[index]?.recipientType
                      const recipientId = assignmentValues?.[index]?.recipientId
                      const dueDate = assignmentValues?.[index]?.dueAt

                      const recipientLabel =
                        getRecipientOptions(recipientType).find(
                          (r) => r.value === recipientId
                        )?.label || ''

                      const dueDateText = dueDate
                        ? ` - Due: ${format(new Date(dueDate), dateFormatPatterns.fullDateTime)}`
                        : ''

                      return `Assignment ${index + 1}: ${recipientTypeName} ${recipientLabel} ${dueDateText}`
                    })()}
                  </Badge>
                </div>
              )}
          </CardContent>
        </Card>
      ))}

      {fields.length > 0 && fields.length < 5 && (
        <Button
          type='button'
          variant='outline'
          className='w-full border-dashed'
          onClick={handleAddAssignment}
        >
          <PlusCircle className='mr-2 h-4 w-4' />
          Add Another Assignment
        </Button>
      )}
    </div>
  )
}
