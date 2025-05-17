import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import $queryClient from '@/api'
import { createTaskSchema } from '@/schemas/task'
import { toast } from 'sonner'
import { taskKeysFactory } from '@/api/query-key-factory'
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
import { TaskAssignmentField } from './components/task-assignment-field'
import { TaskDocumentField } from './components/task-document-field'

export type CreateTasksForm = z.infer<typeof createTaskSchema>

export default function CreateTaskPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const createTaskMutation = $queryClient.useMutation('post', '/api/tasks', {
    onMutate: async (newTask) => {
      // Cancel any outgoing refetches to prevent them overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: taskKeysFactory.lists() })

      // Snapshot the current value
      const previousTasks = queryClient.getQueryData(taskKeysFactory.lists())

      // Optimistically update the list by adding the new task
      queryClient.setQueryData(taskKeysFactory.lists(), (old: any) => {
        if (!old?.data) return old

        // Create a temporary ID for the optimistic update
        const tempId = Date.now()
        const newTaskData = {
          id: tempId,
          content: newTask.body.content,
          instructions: newTask.body.instructions,
          notes: newTask.body.notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          // Add any other required fields with default values
        }

        return {
          ...old,
          data: [newTaskData, ...old.data],
        }
      })

      return { previousTasks }
    },
    onError: (_, __, context: any) => {
      queryClient.setQueryData(taskKeysFactory.lists(), context.previousTasks)
      toast.error('Failed to create task. Please try again.')
    },
    onSuccess: () => {
      toast.success('Task created successfully!')
      // Even with optimistic updates, we still need to invalidate queries
      // to ensure we have the server-generated ID and any other server-side changes
      queryClient.invalidateQueries({
        queryKey: taskKeysFactory.lists(),
      })
      void navigate({ to: '/tasks' })
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: taskKeysFactory.lists() }),
  })

  const form = useForm<CreateTasksForm>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      content: '',
      instructions: '',
      notes: '',
      assignments: [],
      documents: [],
    },
  })

  const onSubmit = async (data: CreateTasksForm) => {
    const { documents, ...rest } = data
    await createTaskMutation.mutateAsync({
      body: {
        ...rest,
        documentIds: documents?.map((doc) => doc.documentId) ?? [],
      },
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
                <TaskAssignmentField />
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
