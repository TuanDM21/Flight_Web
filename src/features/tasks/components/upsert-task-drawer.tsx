import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTaskSchema } from '@/schemas/task'
import { Task } from '@/types/task'
import { Upload, X } from 'lucide-react'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Task
}

type CreateTasksForm = z.infer<typeof createTaskSchema>

export function UpsertTaskDrawer({ open, onOpenChange, currentRow }: Props) {
  const isUpdate = !!currentRow

  const form = useForm<CreateTasksForm>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: currentRow ?? {
      content: '',
      instructions: '',
      notes: '',
      attachments: [],
    },
  })

  const onSubmit = (data: CreateTasksForm) => {
    onOpenChange(false)
    form.reset()
    showSubmittedData(data)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
      }}
    >
      <DialogContent className='flex h-[80vh] max-h-[750px] flex-col'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isUpdate ? 'Update' : 'Create'} Task</DialogTitle>
          <DialogDescription>
            {isUpdate
              ? 'Update the task by providing necessary info.'
              : 'Add a new task by providing necessary info.'}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='flex-1 overflow-hidden'>
          <ScrollArea className='h-full pr-4'>
            <Form {...form}>
              <form
                id='tasks-form'
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-5 px-4 pb-6'
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
          </ScrollArea>
        </div>
        <DialogFooter className='gap-2'>
          <DialogClose asChild>
            <Button variant='outline'>Close</Button>
          </DialogClose>
          <Button form='tasks-form' type='submit'>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
