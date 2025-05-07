import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from '@tanstack/react-router'
import { createTaskSchema } from '@/schemas/task'
import { Task } from '@/types/task'
import { Upload, X, ArrowLeft } from 'lucide-react'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
} from '@/components/ui/file-upload'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { TaskAssignmentField } from './components/task-assignment-field'

type EditTasksForm = z.infer<typeof createTaskSchema>

export default function EditTaskPage() {
  const navigate = useNavigate()
  const params = useParams({ from: '/tasks/$taskId' })
  const [isLoading, setIsLoading] = useState(true)
  const [task, setTask] = useState<Task | null>(null)

  const form = useForm<EditTasksForm>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      content: '',
      instructions: '',
      notes: '',
      assignments: [
        {
          recipientId: undefined,
          recipientType: '',
          dueAt: undefined,
          note: '',
        },
      ],
      attachments: [],
    },
  })

  // Simulate fetching task data
  useEffect(() => {
    const fetchTask = async () => {
      setIsLoading(true)
      try {
        // In a real app, you would fetch the task from your API
        // This is just a simulation
        const mockTask: Task = {
          id: params.taskId,
          content: 'Example content for task ' + params.taskId,
          instructions: 'Example instructions for this task',
          notes: 'Some additional notes for this task',
          attachments: [],
          assignments: [
            {
              recipientId: 1,
              recipientType: 'user',
              dueAt: new Date().toISOString(),
              note: 'Please complete this task as soon as possible',
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        setTask(mockTask)

        // Populate the form with task data
        form.reset({
          content: mockTask.content,
          instructions: mockTask.instructions,
          notes: mockTask.notes,
          attachments: mockTask.attachments,
          assignments: mockTask.assignments || [
            {
              recipientId: undefined,
              recipientType: '',
              dueAt: undefined,
              note: '',
            },
          ],
        })
      } catch (error) {
        console.error('Error fetching task:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchTask()
  }, [params.taskId, form])

  const onSubmit = (data: EditTasksForm) => {
    showSubmittedData(data)
    // Here you'd typically update the data in your backend
    // After successful update, navigate back to the task list
    void navigate({ to: '/tasks' })
  }

  if (isLoading) {
    return (
      <div className='container flex items-center justify-center py-6'>
        <p>Loading task...</p>
      </div>
    )
  }

  if (!task) {
    return (
      <div className='container py-6'>
        <p>Task not found</p>
        <Button
          variant='ghost'
          size='sm'
          className='mt-4'
          onClick={() => navigate({ to: '/tasks' })}
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Tasks
        </Button>
      </div>
    )
  }

  return (
    <div className='container max-w-3xl py-6'>
      <div className='mb-6 flex items-center'>
        <Button
          variant='ghost'
          size='sm'
          className='mr-2'
          onClick={() => navigate({ to: '/tasks' })}
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Tasks
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Task</CardTitle>
          <CardDescription>
            Update task information below. Click save when you're done with your
            changes.
          </CardDescription>
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

              {/* Task Assignment Field Component */}
              <TaskAssignmentField />

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

              <FormField
                control={form.control}
                name='attachments'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attachments</FormLabel>
                    <FormControl>
                      <FileUpload
                        value={field.value}
                        onValueChange={field.onChange}
                        accept='image/*'
                        maxFiles={2}
                        maxSize={5 * 1024 * 1024}
                        onFileReject={(_, message) => {
                          form.setError('attachments', {
                            message,
                          })
                        }}
                        multiple
                      >
                        <FileUploadDropzone className='flex-row flex-wrap border-dotted text-center'>
                          <div className='flex flex-col items-center gap-1 text-center'>
                            <div className='flex items-center justify-center rounded-full border p-2.5'>
                              <Upload className='text-muted-foreground size-6' />
                            </div>
                            <p className='text-sm font-medium'>
                              Drag & drop files here
                            </p>
                            <p className='text-muted-foreground text-xs'>
                              Or click to browse (max 2 files, up to 5MB each)
                            </p>
                          </div>
                        </FileUploadDropzone>
                        <FileUploadList>
                          {field.value.map((file, index) => (
                            <FileUploadItem key={index} value={file}>
                              <FileUploadItemPreview />
                              <FileUploadItemMetadata />
                              <FileUploadItemDelete asChild>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  className='size-7'
                                >
                                  <X />
                                  <span className='sr-only'>Delete</span>
                                </Button>
                              </FileUploadItemDelete>
                            </FileUploadItem>
                          ))}
                        </FileUploadList>
                      </FileUpload>
                    </FormControl>
                    <FormDescription>
                      Upload up to 2 images up to 5MB each.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Sticky submit button */}
      <div className='bg-background fixed right-0 bottom-0 left-0 z-10 flex justify-end gap-2 border-t p-4'>
        <Button variant='outline' onClick={() => navigate({ to: '/tasks' })}>
          Cancel
        </Button>
        <Button form='tasks-form' type='submit'>
          Update Task
        </Button>
      </div>
    </div>
  )
}
