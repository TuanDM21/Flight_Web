import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { createTaskSchema } from '@/schemas/task'
import { Upload, X } from 'lucide-react'
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

type CreateTasksForm = z.infer<typeof createTaskSchema>

export default function CreateTaskPage() {
  const navigate = useNavigate()

  const form = useForm<CreateTasksForm>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      content: '',
      instructions: '',
      notes: '',
      attachments: [],
      assignments: [],
    },
  })

  const onSubmit = (data: CreateTasksForm) => {
    showSubmittedData(data)
    // Here you'd typically save the data to your backend
    // After successful save, navigate back to the task list
    void navigate({ to: '/tasks' })
  }

  return (
    <div className='px-4 py-2'>
      <Card className='py-2'>
        <CardHeader>
          <CardTitle>Create Task</CardTitle>
          <CardDescription>
            Add a new task by providing necessary information. Click save when
            you're done.
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
  )
}
