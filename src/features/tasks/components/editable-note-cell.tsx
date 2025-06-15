import React from 'react'
import { z } from 'zod'
import { UseFormReturn } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { FormFieldTooltipError } from '@/components/form-field-tooltip-error'
import { updateTaskAssignmentSchema } from '@/features/tasks/schema'
import { TaskAssignment } from '@/features/tasks/types'

type TaskAssignmentUpdateForm = z.infer<typeof updateTaskAssignmentSchema> & {
  assignmentId?: number
}

interface EditableNoteCellProps {
  assignment: TaskAssignment
  assignmentId: number
  form: UseFormReturn<TaskAssignmentUpdateForm>
}

export const EditableNoteCell = React.memo(
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
                    placeholder='Thêm ghi chú'
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
    return <div>{assignment.note || 'Không có ghi chú'}</div>
  }
)

EditableNoteCell.displayName = 'EditableNoteCell'
