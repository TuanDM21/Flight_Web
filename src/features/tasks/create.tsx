import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
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
import { TaskAssignmentField } from './components/task-assignment-field'
import { TaskDocumentField } from './components/task-document-field'
import { useCreateTaskMutation } from './hooks/use-create-task'

export type CreateTasksForm = z.infer<typeof createTaskSchema>

export default function CreateTaskPage() {
  const navigate = useNavigate()
  const createTaskMutation = useCreateTaskMutation()

  const form = useForm<CreateTasksForm>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      content: '',
      instructions: '',
      notes: '',
      assignments: [],
      documentIds: [],
    },
  })

  const onSubmit = async (data: CreateTasksForm) => {
    const { documentIds, ...rest } = data
    const createTaskPromise = createTaskMutation.mutateAsync({
      body: {
        ...rest,
        documentIds: documentIds ?? [],
      },
    })

    toast.promise(createTaskPromise, {
      loading: `Creating task...`,
      success: `Task created successfully!`,
      error: `Failed to create task. Please try again.`,
    })
    void navigate({ to: '/tasks' })
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
                <TaskAssignmentField form={form} name={'assignments'} />
                <TaskDocumentField />
              </form>
            </Form>
          </CardContent>
          <div className='bg-background sticky bottom-0 z-10 flex items-center justify-end space-x-2 border-t px-2 pt-2'>
            <Button
              variant='outline'
              size='lg'
              onClick={() => void navigate({ to: '/tasks' })}
            >
              Save as Draft
            </Button>
            <Button form='tasks-form' type='submit' size='lg'>
              Save Task
            </Button>
          </div>
        </Card>
      </div>
    </TasksProvider>
  )
}
