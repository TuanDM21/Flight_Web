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
    <div className='space-y-6'>
      {/* Content Section */}
      <div className='space-y-6'>
        <div className='flex items-center justify-between border-b border-gray-200 pb-4'>
          <div>
            <h3 className='text-xl font-semibold text-gray-800'>
              Danh sách phân công
            </h3>
            <p className='text-sm text-gray-600'>
              Quản lý các phân công cho nhiệm vụ này
            </p>
          </div>
          {fields.length > 0 && fields.length < 5 && (
            <Button
              type='button'
              variant='default'
              size='sm'
              onClick={handleAddAssignment}
              className='flex items-center gap-2'
            >
              <PlusCircle className='size-4' />
              Thêm phân công
            </Button>
          )}
        </div>

        {fields.length === 0 && (
          <Card className='border-2 border-dashed border-gray-300'>
            <CardContent className='flex flex-col items-center justify-center py-12'>
              <div className='flex size-16 items-center justify-center rounded-full bg-gray-100'>
                <UserIcon className='size-8 text-gray-400' />
              </div>
              <p className='text-muted-foreground mt-2 text-sm'>
                Chưa có phân công nào
              </p>
              <Button
                type='button'
                variant='secondary'
                onClick={handleAddAssignment}
                className='mt-6'
              >
                <PlusCircle className='mr-2 size-4' />
                Thêm phân công đầu tiên
              </Button>
            </CardContent>
          </Card>
        )}

        <div className='space-y-6'>
          {fields.map((field, index) => (
            <Card key={field.id} className='border-l-4 p-6 shadow-sm'>
              <div className='mb-6 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='flex size-10 items-center justify-center rounded-full bg-purple-100 text-sm font-bold'>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className='text-lg font-semibold text-gray-800'>
                      Phân công {index + 1}
                    </h4>
                    <p className='text-sm text-gray-500'>
                      Chỉ định người thực hiện và thời hạn hoàn thành
                    </p>
                  </div>
                </div>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => remove(index)}
                  className='flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700'
                >
                  <X className='size-4' />
                  Xóa phân công
                </Button>
              </div>
              <div className='space-y-6'>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                  <FormField
                    control={form.control}
                    name={`${name}.${index}.recipientType` as Path<T>}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-sm font-medium text-gray-700'>
                          Loại người nhận *
                        </FormLabel>
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
                          <FormControl>
                            <SelectTrigger className='border-gray-300'>
                              <SelectValue placeholder='Chọn loại người nhận' />
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
                          <FormLabel className='text-sm font-medium text-gray-700'>
                            Người nhận *
                          </FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(Number(value))
                            }}
                            value={field.value ? String(field.value) : ''}
                            disabled={!currentRecipientType}
                          >
                            <FormControl>
                              <SelectTrigger className='border-gray-300'>
                                <SelectValue placeholder='Chọn người nhận' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {(() => {
                                const options = getRecipientOptions(
                                  currentRecipientType || ''
                                )
                                if (options.length === 0) {
                                  return (
                                    <div className='px-2 py-1.5 text-sm text-gray-500'>
                                      Không có người nhận nào
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
                        <FormLabel className='text-sm font-medium text-gray-700'>
                          Ngày hạn *
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant='outline'
                                className={cn(
                                  'w-full border-gray-300 pl-3 text-left font-normal',
                                  !field.value && 'text-gray-500'
                                )}
                              >
                                {field.value ? (
                                  format(
                                    new Date(field.value),
                                    dateFormatPatterns.fullDate
                                  )
                                ) : (
                                  <span>Chọn ngày hạn</span>
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
                    <FormItem>
                      <FormLabel className='text-sm font-medium text-gray-700'>
                        Ghi chú
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Thêm ghi chú, hướng dẫn hoặc yêu cầu đặc biệt cho phân công này...'
                          className='min-h-24 border-gray-300'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Assignment Summary Badge */}
                {assignmentValues?.[index]?.recipientId &&
                  assignmentValues?.[index]?.recipientType && (
                    <div className='rounded-lg border border-purple-200 bg-purple-50 p-3'>
                      <div className='flex items-center gap-2'>
                        <div className='size-2 rounded-full'></div>
                        <span className='text-sm font-medium'>
                          Tóm tắt phân công
                        </span>
                      </div>
                      <p className='mt-1 text-sm'>
                        {(() => {
                          const recipientTypeName = deriveRecipientOptions.find(
                            (t) =>
                              t.value ===
                              assignmentValues?.[index]?.recipientType
                          )?.label
                          const recipientType =
                            assignmentValues?.[index]?.recipientType
                          const recipientId =
                            assignmentValues?.[index]?.recipientId
                          const dueDate = assignmentValues?.[index]?.dueAt

                          const recipientLabel =
                            getRecipientOptions(recipientType).find(
                              (r) => r.value === recipientId
                            )?.label || ''

                          const dueDateText = dueDate
                            ? ` - Hạn: ${format(new Date(dueDate), dateFormatPatterns.fullDate)}`
                            : ''

                          return `${recipientTypeName}: ${recipientLabel}${dueDateText}`
                        })()}
                      </p>
                    </div>
                  )}
              </div>
            </Card>
          ))}
        </div>

        {fields.length > 0 && (
          <Button
            type='button'
            variant='outline'
            className='w-full border-2 border-dashed'
            onClick={handleAddAssignment}
          >
            <PlusCircle className='mr-2 h-4 w-4' />
            Thêm phân công khác
          </Button>
        )}
      </div>
    </div>
  )
}
