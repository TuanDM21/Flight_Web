import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { IconTableShare } from '@tabler/icons-react'
import { Eye, Trash, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { convertToFile } from '@/utils/file'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
} from '@/components/ui/file-upload'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AppDialog } from '@/components/app-dialog'
import { DataTableActionBarAction } from '@/components/data-table/data-table-action-bar'
import { SelectAttachmentsDialog } from './components/select-attachments-dialog'
import {
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE,
  MAX_FILES_COUNT,
  MAX_TOTAL_FILES_SIZE,
} from './constants'
import { useCreateDocument } from './hooks/use-create-document'
import { useUploadAttachments } from './hooks/use-upload-attachments'
import { createDocumentSchema } from './schema'
import { CreateDocumentForm, DocumentAttachment } from './types'

export default function CreateDocumentPage() {
  const navigate = useNavigate()
  const createDocumentMutation = useCreateDocument()
  const uploadAttachments = useUploadAttachments()
  const selectAttachmentsDialog = AppDialog.useDialog()

  const form = useForm<CreateDocumentForm>({
    resolver: zodResolver(createDocumentSchema),
    defaultValues: {
      content: '',
      documentType: '',
      notes: '',
      files: [] as File[],
      attachments: [],
    },
  })

  const handleSelectAttachments = React.useCallback(
    async (attachments: DocumentAttachment[]) => {
      selectAttachmentsDialog.close()
      const selectedFiles =
        (attachments.length ?? 0) > 0
          ? await Promise.all(
              attachments.map(async (att) => {
                try {
                  const file = await convertToFile(att)
                  Object.assign(file, {
                    __uploaded: true,
                  })
                  return file
                } catch (error) {
                  toast.error(
                    `The attachment "${att.fileName}" is not a valid file. Please select a different attachment.`
                  )
                  return null
                }
              }) ?? []
            )
          : []
      const allSelectedFiles = [
        ...(form.getValues('files') ?? []),
        ...selectedFiles.filter((file): file is File => file !== null),
      ]
      const allSelectedAttachments = [
        ...(form.getValues('attachments') ?? []),
        ...attachments,
      ] as Required<DocumentAttachment>[]

      form.setValue('files', allSelectedFiles)
      form.setValue('attachments', allSelectedAttachments)
    },
    [form, selectAttachmentsDialog]
  )

  const handleSubmit = async (data: CreateDocumentForm) => {
    const createDocumentPromise = createDocumentMutation.mutateAsync({
      body: {
        documentType: data.documentType,
        content: data.content,
        notes: data.notes,
        attachmentIds:
          data.attachments?.map((attachment) => attachment.id) ?? [],
      },
    })
    toast.promise(createDocumentPromise, {
      loading: 'Creating document...',
      success: () => {
        navigate({ to: '/documents' })
        return 'Document created successfully!'
      },
      error: 'Failed to create document. Please try again.',
    })
  }

  const onUpload = React.useCallback(
    async (
      files: File[],
      {
        onProgress,
        onSuccess,
        onError,
      }: {
        onProgress: (file: File, progress: number) => void
        onSuccess: (file: File) => void
        onError: (file: File, error: Error) => void
      }
    ) => {
      const result = await uploadAttachments(files, {
        onProgress,
        onSuccess,
        onError,
      })

      if (result.success) {
        form.setValue('attachments', result.confirmedAttachments)
      }
    },
    [uploadAttachments]
  )

  const onFileReject = React.useCallback((file: File, message: string) => {
    form.setError('files', {
      message,
    })
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    })
  }, [])

  const handleOpenPreview = React.useCallback((file: File) => {
    const attachments = form.getValues('attachments') ?? []
    const attachment = attachments.find((a) => a.fileName === file.name)
    if (attachment) {
      window.open(attachment.filePath, '_blank', 'noopener,noreferrer')
    }
  }, [])

  return (
    <>
      {selectAttachmentsDialog.isOpen && (
        <SelectAttachmentsDialog
          dialog={selectAttachmentsDialog}
          getSelectedAttachmentIds={() =>
            form.getValues('attachments')?.map((a) => a.id) ?? []
          }
          onSubmit={handleSelectAttachments}
        />
      )}
      <div className='px-4 py-2'>
        <Card className='py-4'>
          <CardHeader>
            <CardTitle>Create Document</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                id='document-form'
                onSubmit={form.handleSubmit(handleSubmit)}
                className='space-y-6'
              >
                <FormField
                  control={form.control}
                  name='documentType'
                  render={({ field }) => (
                    <FormItem className='space-y-1'>
                      <FormLabel>Document Type</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='Enter document type' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  name='files'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Attachments</FormLabel>
                      <FormControl>
                        <div className='border-primary/30 bg-background relative flex flex-col items-center rounded-lg border-2 border-dashed p-4 font-medium transition-colors'>
                          <Button
                            type='button'
                            variant='outline'
                            className='flex min-h-20 w-full flex-col items-center rounded-lg border-2 border-dashed'
                            onClick={(evt) => {
                              evt.preventDefault()
                              evt.stopPropagation()
                              selectAttachmentsDialog.open()
                            }}
                          >
                            <span className='flex items-center gap-2'>
                              <IconTableShare className='size-5' />
                              Choose from shared attachments
                            </span>
                          </Button>
                          <div className='flex w-full flex-col items-center'>
                            <div className='my-4 flex w-full items-center gap-2'>
                              <div className='border-muted-foreground/30 flex-grow border-t'></div>
                              <span className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>
                                or
                              </span>
                              <div className='border-muted-foreground/30 flex-grow border-t'></div>
                            </div>
                            <div className='w-full'>
                              <FileUpload
                                value={field.value}
                                onValueChange={field.onChange}
                                accept={ACCEPTED_FILE_TYPES.join(',')}
                                maxFiles={MAX_FILES_COUNT}
                                maxSize={MAX_FILE_SIZE}
                                maxTotalSize={MAX_TOTAL_FILES_SIZE}
                                onFileReject={onFileReject}
                                onUpload={onUpload}
                                multiple
                              >
                                <FileUploadDropzone className='p-4'>
                                  <div className='flex w-full flex-col items-center gap-1 rounded-lg px-2 py-3 text-center'>
                                    <div className='bg-primary/5 mb-1 flex items-center justify-center rounded-full border p-2.5'>
                                      <Upload className='text-primary size-6' />
                                    </div>
                                    <p className='text-sm font-medium'>
                                      Drag & drop files here or click to select
                                      from your device
                                    </p>
                                    <p className='text-muted-foreground text-xs'>
                                      (Up to {MAX_FILES_COUNT} files,{' '}
                                      {MAX_FILE_SIZE / 1024 / 1024}MB each,
                                      total {MAX_TOTAL_FILES_SIZE / 1024 / 1024}
                                      MB)
                                    </p>
                                  </div>
                                  <FileUploadList className='w-full'>
                                    {field.value?.map((file, index) => (
                                      <FileUploadItem
                                        key={index}
                                        value={file}
                                        className='flex-col'
                                      >
                                        <div className='flex w-full items-center gap-2'>
                                          <FileUploadItemPreview />
                                          <FileUploadItemMetadata />
                                          <DataTableActionBarAction
                                            type='button'
                                            size='icon'
                                            tooltip='View file'
                                            onClick={() =>
                                              handleOpenPreview(file)
                                            }
                                          >
                                            <Eye />
                                          </DataTableActionBarAction>
                                          <FileUploadItemDelete
                                            type='button'
                                            asChild
                                          >
                                            <DataTableActionBarAction
                                              type='button'
                                              size='icon'
                                              tooltip='Remove file'
                                            >
                                              <Trash />
                                            </DataTableActionBarAction>
                                          </FileUploadItemDelete>
                                        </div>
                                        <FileUploadItemProgress />
                                      </FileUploadItem>
                                    ))}
                                  </FileUploadList>
                                </FileUploadDropzone>
                              </FileUpload>
                            </div>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <div className='bg-background sticky bottom-0 z-10 flex items-center justify-end space-x-2 border-t px-2 pt-4'>
            <Button
              variant='outline'
              size='lg'
              onClick={() => void navigate({ to: '/documents' })}
            >
              Cancel
            </Button>
            <Button form='document-form' type='submit' size='lg'>
              Create Document
            </Button>
          </div>
        </Card>
      </div>
    </>
  )
}
