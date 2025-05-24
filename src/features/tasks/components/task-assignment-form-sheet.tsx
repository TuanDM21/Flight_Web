import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { createTaskAssignmentsSchema } from '../schema'
import { TaskAssignmentField } from './task-assignment-field'

type TaskSheetFormValues = z.infer<typeof createTaskAssignmentsSchema>

interface TaskAssignmentSheetFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: TaskSheetFormValues) => void
}

export default function TaskAssignmentFormSheet({
  open,
  onOpenChange,
  onSubmit,
}: TaskAssignmentSheetFormProps) {
  const form = useForm<TaskSheetFormValues>({
    resolver: zodResolver(createTaskAssignmentsSchema),
    defaultValues: {
      assignments: [],
    },
  })

  const handleSubmit = async (data: TaskSheetFormValues) => {
    onSubmit(data)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='h-full w-full sm:max-w-2xl'>
        <SheetHeader>
          <SheetTitle>Create Task Assignment</SheetTitle>
        </SheetHeader>
        <Card className='border-none shadow-none'>
          <CardContent className='p-4'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className='space-y-2'
              >
                <TaskAssignmentField form={form} name='assignments' />
                <Button type='submit' size='lg' className='w-full'>
                  Save
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </SheetContent>
    </Sheet>
  )
}
