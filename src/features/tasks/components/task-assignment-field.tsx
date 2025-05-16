import { format } from 'date-fns'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import $queryClient from '@/api'
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
import { CreateTasksForm } from '../create'

// Mock recipient types - in a real app, these would come from an API
const RECIPIENT_TYPES = [
  { label: 'User', value: 'user' },
  { label: 'Team', value: 'team' },
  { label: 'Unit', value: 'unit' },
]

export function TaskAssignmentField() {
  const getTeamQuery = $queryClient.useQuery('get', '/api/teams')
  const getUnitsQuery = $queryClient.useQuery('get', '/api/units')
  const getUsersQuery = $queryClient.useQuery('get', '/api/users')

  const form = useFormContext<CreateTasksForm>()
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'assignments',
  })

  const assignmentValues = useWatch({
    control: form.control,
    name: 'assignments',
  })

  const handleAddAssignment = () => {
    append({
      recipientId: undefined!,
      recipientType: '',
      dueAt: undefined!,
      note: '',
    })
  }

  const getRecipientOptions = (type: string) => {
    if (type === 'team')
      return (
        (getTeamQuery.data?.data ?? []).map((team) => ({
          value: team.id,
          label: team.teamName,
        })) ?? []
      )

    if (type === 'unit')
      return (
        (getUnitsQuery.data?.data ?? []).map((unit) => ({
          value: unit.id,
          label: unit.unitName,
        })) ?? []
      )

    return (
      (getUsersQuery.data?.data ?? []).map((user) => ({
        value: user.id,
        label: user.name,
      })) ?? []
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <FormLabel className='text-base font-medium'>Assignments</FormLabel>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={handleAddAssignment}
          className='flex items-center gap-1'
        >
          <PlusCircle className='h-4 w-4' />
          <span>Add Assignment</span>
        </Button>
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
            <div className='grid grid-cols-12 items-start gap-4'>
              <FormField
                control={form.control}
                name={`assignments.${index}.recipientType`}
                render={({ field }) => (
                  <FormItem className='col-span-3'>
                    <FormLabel>Recipient Type</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        form.setValue(
                          `assignments.${index}.recipientId`,
                          undefined!,
                          {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          }
                        )
                      }}
                      value={field.value}
                    >
                      <FormControl className='w-full'>
                        <SelectTrigger>
                          <SelectValue placeholder='Select recipient type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {RECIPIENT_TYPES.map((type) => (
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
                name={`assignments.${index}.recipientId`}
                render={({ field }) => (
                  <FormItem className='col-span-5'>
                    <FormLabel>Recipient</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(Number(value))
                      }}
                      value={field.value?.toString()}
                      disabled={
                        !form.getValues(`assignments.${index}.recipientType`)
                      }
                    >
                      <FormControl className='w-full'>
                        <SelectTrigger>
                          <SelectValue placeholder='Select recipient' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getRecipientOptions(
                          assignmentValues?.[index]?.recipientType || ''
                        )?.map((recipient) => (
                          <SelectItem
                            key={recipient.value}
                            value={(recipient.value ?? '').toString()}
                          >
                            {recipient.label}
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
                name={`assignments.${index}.dueAt`}
                render={({ field }) => (
                  <FormItem className='col-span-4'>
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
              name={`assignments.${index}.note`}
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

            {/* Show assignment status badge when data is present */}
            {form.getValues(`assignments.${index}.recipientId`) &&
              form.getValues(`assignments.${index}.recipientType`) && (
                <div className='mt-4'>
                  <Badge
                    variant='outline'
                    className='border-dashed p-2 text-xs'
                  >
                    {(() => {
                      const recipientTypeName = RECIPIENT_TYPES.find(
                        (t) =>
                          t.value ===
                          form.getValues(`assignments.${index}.recipientType`)
                      )?.label
                      const recipientType = form.getValues(
                        `assignments.${index}.recipientType`
                      )
                      const recipientId = form.getValues(
                        `assignments.${index}.recipientId`
                      )
                      const dueDate = form.getValues(
                        `assignments.${index}.dueAt`
                      )

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
