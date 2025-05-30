import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import {
  EditTaskRoute,
  getTaskDetailQueryOptions,
} from '@/routes/_authenticated/tasks/$task-id/edit'
import { toast } from 'sonner'
import TasksProvider from '@/context/task'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { createTaskSchema } from '@/features/tasks/schema'
import { useUpdateTaskMutation } from './hooks/use-update-task'

export type CreateTasksForm = z.infer<typeof createTaskSchema>

export default function EditTaskPage() {
  const taskId = EditTaskRoute.useParams()['task-id']
  const { data: taskDetailsQuery } = useSuspenseQuery(
    getTaskDetailQueryOptions(Number(taskId))
  )

  const navigate = useNavigate()
  const updateTaskMutation = useUpdateTaskMutation(Number(taskId))

  const taskData = taskDetailsQuery?.data || {}

  const form = useForm<CreateTasksForm>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      content: taskData.content || '',
      instructions: taskData.instructions || '',
      notes: taskData.notes || '',
      assignments:
        taskData.assignments?.map((assignment) => ({
          recipientId: assignment.recipientId,
          recipientType: assignment.recipientType,
          dueAt: assignment.dueAt || '',
          note: assignment.note || '',
        })) || [],
    },
  })

  const onSubmit = async (data: CreateTasksForm) => {
    const { content, instructions, notes } = data

    const taskUpdatePromise = updateTaskMutation.mutateAsync({
      params: {
        path: {
          id: Number(taskId),
        },
      },
      body: {
        content,
        instructions,
        notes,
      },
    })

    toast.promise(taskUpdatePromise, {
      loading: `Updating task #${taskId}...`,
      success: () => {
        void navigate({ to: '/tasks' })
        return `Task #${taskId} updated successfully!`
      },
      error: `Failed to update task #${taskId}`,
    })
  }

  return (
    <TasksProvider>
      <div className='px-4 py-2'>
        <Card className='py-4'>
          <CardHeader>
            <CardTitle>Create Task</CardTitle>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                id='tasks-form'
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
              >
                <FormField
                  control={form.control}
                  name='content'
                  render={({ field }) => (
                    <FormItem className='space-y-1'>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className='min-h-32'
                          placeholder='Enter your content here'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='instructions'
                  render={({ field }) => (
                    <FormItem className='space-y-1'>
                      <FormLabel>Instructions</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className='min-h-32'
                          placeholder='Enter your instructions here'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='notes'
                  render={({ field }) => (
                    <FormItem className='space-y-1'>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className='min-h-32'
                          placeholder='Enter your notes here'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <div className='bg-background sticky bottom-0 z-10 flex items-center justify-end space-x-2 border-t px-2 pt-2'>
            <Button variant='outline' size='lg'>
              Save as Draft
            </Button>
            <Button
              form='tasks-form'
              type='submit'
              size='lg'
              disabled={updateTaskMutation.isPending}
            >
              Save Task
            </Button>
          </div>
        </Card>
      </div>
    </TasksProvider>
  )
}
