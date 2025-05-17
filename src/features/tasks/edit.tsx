import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import $queryClient from '@/api'
import {
  EditTaskRoute,
  getTaskDetailQueryOptions,
} from '@/routes/_authenticated/tasks/$task-id/edit'
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

export default function EditTaskPage() {
  const taskId = EditTaskRoute.useParams()['task-id']
  const { data: taskDetailsQuery } = useSuspenseQuery(
    getTaskDetailQueryOptions(Number(taskId))
  )

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const updateTaskMutation = $queryClient.useMutation(
    'put',
    `/api/tasks/{id}`,
    {
      onMutate: async (variables) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries({
          queryKey: taskKeysFactory.detail(Number(taskId)),
        })
        await queryClient.cancelQueries({
          queryKey: taskKeysFactory.lists(),
        })

        // Snapshot the previous values
        const previousTaskDetail = queryClient.getQueryData(
          taskKeysFactory.detail(Number(taskId))
        )
        const previousTasksList = queryClient.getQueryData(
          taskKeysFactory.lists()
        )

        const { content, instructions, notes } = variables?.body || {}

        // Optimistically update the task detail
        queryClient.setQueryData(
          taskKeysFactory.detail(Number(taskId)),
          (old: any) => {
            if (!old) return old

            return {
              ...old,
              data: {
                ...old.data,
                content,
                instructions,
                notes,
              },
            }
          }
        )

        queryClient.setQueryData(taskKeysFactory.lists(), (old: any) => {
          return {
            ...old,
            data: old.data.map((task: any) =>
              task.id === Number(taskId)
                ? {
                    ...task,
                    content,
                    instructions,
                    notes,
                  }
                : task
            ),
          }
        })

        // Return the previous values so we can revert if something goes wrong
        return { previousTaskDetail, previousTasksList }
      },
      onError: (_, __, context: any) => {
        queryClient.setQueryData(
          taskKeysFactory.lists(),
          context.previousTasksList
        )
        queryClient.setQueryData(
          taskKeysFactory.detail(Number(taskId)),
          context.previousTaskDetail
        )
        toast.error('Failed to update task. Please try again.')
      },
      onSuccess: () => {
        toast.success('Task updated successfully!')
        void navigate({ to: '/tasks' })
      },
      onSettled: () =>
        queryClient.invalidateQueries({
          queryKey: taskKeysFactory.detail(Number(taskId)),
        }),
    }
  )

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
      documents:
        taskData.documents?.map((doc) => ({
          documentId: doc.id,
          documentType: doc.documentType,
          content: doc.content,
          notes: doc.notes || '',
          attachments:
            doc.attachments?.map((att) => ({
              filePath: att.filePath || '',
              fileName: att.fileName || '',
            })) || [],
        })) || [],
    },
  })

  const onSubmit = async (data: CreateTasksForm) => {
    const { content, instructions, notes } = data

    await updateTaskMutation.mutateAsync({
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
