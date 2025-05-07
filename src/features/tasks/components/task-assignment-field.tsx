import { useState } from 'react'
import { format } from 'date-fns'
import { useFieldArray, useFormContext } from 'react-hook-form'
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

// Mock recipient types - in a real app, these would come from an API
const RECIPIENT_TYPES = [
  { label: 'User', value: 'user' },
  { label: 'Team', value: 'team' },
  { label: 'Unit', value: 'unit' },
  { label: 'Role', value: 'role' },
]

// Mock recipients - in a real app, these would be fetched based on the selected type
const MOCK_RECIPIENTS = {
  user: [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Robert Johnson' },
  ],
  team: [
    { id: 101, name: 'Engineering' },
    { id: 102, name: 'Marketing' },
    { id: 103, name: 'Sales' },
  ],
  unit: [
    { id: 201, name: 'North Division' },
    { id: 202, name: 'South Division' },
    { id: 203, name: 'East Division' },
  ],
  role: [
    { id: 301, name: 'Manager' },
    { id: 302, name: 'Developer' },
    { id: 303, name: 'Designer' },
  ],
}

export function TaskAssignmentField() {
  const form = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'assignments',
  })

  const [selectedType, setSelectedType] = useState<string>('')

  const handleAddAssignment = () => {
    append({
      recipientId: undefined,
      recipientType: '',
      dueAt: undefined,
      note: '',
    })
  }

  const getRecipientOptions = (type: string) => {
    return MOCK_RECIPIENTS[type as keyof typeof MOCK_RECIPIENTS] || []
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
            {/* Combined row for recipient selection and due date */}
            <div className='grid grid-cols-12 gap-4'>
              {/* Recipient Type Selection - Takes 3 columns */}
              <FormField
                control={form.control}
                name={`assignments.${index}.recipientType`}
                render={({ field }) => (
                  <FormItem className='col-span-3'>
                    <FormLabel>Recipient Type</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedType(value)
                        // Clear recipient ID when type changes
                        form.setValue(
                          `assignments.${index}.recipientId`,
                          undefined
                        )
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Type' />
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

              {/* Recipient Selection - Takes 5 columns */}
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
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select recipient' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getRecipientOptions(
                          form.getValues(`assignments.${index}.recipientType`)
                        ).map((recipient) => (
                          <SelectItem
                            key={recipient.id}
                            value={recipient.id.toString()}
                          >
                            {recipient.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Due Date - Takes 4 columns */}
              <FormField
                control={form.control}
                name={`assignments.${index}.dueAt`}
                render={({ field }) => (
                  <FormItem className='col-span-4'>
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), 'PP')
                            ) : (
                              <span>Pick a date</span>
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
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes - Full width row */}
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
                    Assignment {index + 1}:&nbsp;
                    {
                      RECIPIENT_TYPES.find(
                        (t) =>
                          t.value ===
                          form.getValues(`assignments.${index}.recipientType`)
                      )?.label
                    }
                    &nbsp;
                    {getRecipientOptions(
                      form.getValues(`assignments.${index}.recipientType`)
                    ).find(
                      (r) =>
                        r.id ===
                        form.getValues(`assignments.${index}.recipientId`)
                    )?.name || ''}
                    {form.getValues(`assignments.${index}.dueAt`) &&
                      ` - Due: ${format(new Date(form.getValues(`assignments.${index}.dueAt`)), 'PP')}`}
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
