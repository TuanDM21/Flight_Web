import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { AppDialogInstance } from '@/hooks/use-dialog-instance'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { AppSheet } from '@/components/app-sheet'
import { useCreateTaskAssignmentsMutation } from '../hooks/use-create-task-assignments'
import { createTaskAssignmentsSchema } from '../schema'
import { TaskAssignmentField } from './task-assignment-field'

type TaskSheetFormValues = z.infer<typeof createTaskAssignmentsSchema>

interface TaskAssignmentFormSheetProps {
  taskId: number
  dialog: AppDialogInstance
}

export const TaskAssignmentFormSheet = ({
  taskId,
  dialog,
}: TaskAssignmentFormSheetProps) => {
  const taskAssignmentsMutation = useCreateTaskAssignmentsMutation()

  const form = useForm<TaskSheetFormValues>({
    resolver: zodResolver(createTaskAssignmentsSchema),
    defaultValues: {
      assignments: [],
    },
  })

  const handleSubmit = async (data: TaskSheetFormValues) => {
    const promise = taskAssignmentsMutation.mutateAsync({
      body: {
        assignments: data.assignments,
        taskId: taskId,
      },
    })

    toast.promise(promise, {
      loading: `Creating task assignment...`,
      success: () => {
        dialog.close()
        form.reset()
        return `Task assignment created successfully!`
      },
      error: `Failed to create task assignment. Please try again.`,
    })
  }

  return (
    <AppSheet dialog={dialog}>
      <SheetContent className='h-full w-full sm:max-w-2xl'>
        <SheetHeader className='flex-shrink-0 border-b'>
          <SheetTitle>Create Task Assignment</SheetTitle>
          <SheetDescription>
            Create new assignments for this task.
          </SheetDescription>
        </SheetHeader>

        <div className='flex min-h-0 flex-1 flex-col p-4'>
          <Card className='flex-1 border-none shadow-none'>
            <CardContent className='h-full p-0'>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className='flex h-full flex-col space-y-4'
                >
                  <div className='flex-1 overflow-y-auto'>
                    <TaskAssignmentField form={form} name='assignments' />
                  </div>
                  <div className='flex-shrink-0 border-t pt-4'>
                    <Button type='submit' size='lg' className='w-full'>
                      Create Assignments
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </AppSheet>
  )
}
