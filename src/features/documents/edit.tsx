import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { IconTableShare } from '@tabler/icons-react'
import { EditDocumentRoute } from '@/routes/_authenticated/documents/$document-id/edit'
import { Eye, Trash, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { convertToFile } from '@/utils/file'
import {
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE,
  MAX_FILES_COUNT,
  MAX_TOTAL_FILES_SIZE,
} from '@/constants/file'
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
import { useUploadAttachments } from '../attachments/hooks/use-upload-attachments'
import { SelectAttachmentsDialog } from './components/select-attachments-dialog'
import { getDocumentDetailQueryOptions } from './hooks/use-document-detail'
import { useUnlinkAttachmentsFromDocument } from './hooks/use-unlink-attachments-from-document'
import { useUpdateDocument } from './hooks/use-update-document'
import { createDocumentSchema } from './schema'
import { CreateDocumentForm, DocumentAttachment } from './types'

export default function EditDocumentPage() {
  const documentId = EditDocumentRoute.useParams()['document-id']
  const { data: documentDetailsQuery } = useSuspenseQuery(
    getDocumentDetailQueryOptions(Number(documentId))
  )
  const currentDocument = documentDetailsQuery?.data || {}

  const uploadAttachments = useUploadAttachments()
  const navigate = useNavigate()
  const updateDocumentMutation = useUpdateDocument()
  const deleteDocumentAttachmentsMutation = useUnlinkAttachmentsFromDocument()
  const selectAttachmentsDialog = AppDialog.useDialog()

  const form = useForm<CreateDocumentForm>({
    resolver: zodResolver(createDocumentSchema),
    defaultValues: async () => {
      const files =
        (currentDocument.attachments?.length ?? 0) > 0
          ? await Promise.all(
              currentDocument.attachments?.map(async (att) => {
                const file = await convertToFile(att)
                Object.assign(file, {
                  __uploaded: true,
                })
                return file
              }) ?? []
            )
          : []

      return {
        documentType: currentDocument.documentType || '',
        content: currentDocument.content || '',
        notes: currentDocument.notes || '',
        attachments:
          currentDocument.attachments as Required<DocumentAttachment>[],
        files,
      }
    },
  })
  const uploadedAttachments = form.watch('attachments') ?? []

  const onSubmit = async (data: CreateDocumentForm) => {
    const { files, attachments, ...rest } = data
    const documentUpdatePromise = updateDocumentMutation.mutateAsync({
      params: {
        path: {
          id: Number(documentId),
        },
      },
      body: {
        ...rest,
        attachmentIds: attachments?.map((att) => att.id),
      },
    })

    toast.promise(documentUpdatePromise, {
      loading: `Updating document #${documentId}...`,
      success: () => {
        void navigate({ to: '/documents' })
        return `Document #${documentId} updated successfully!`
      },
      error: `Failed to update document #${documentId}`,
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

  const handleSelectAttachments = React.useCallback(
    async (attachments: Required<DocumentAttachment>[]) => {
      selectAttachmentsDialog.close()
      const selectedFiles =
        (attachments.length ?? 0) > 0
          ? await Promise.all(
              attachments.map(async (att) => {
                const file = await convertToFile(att)
                Object.assign(file, {
                  __uploaded: true,
                })
                return file
              }) ?? []
            )
          : []
      const allSelectedFiles = [
        ...(form.getValues('files') ?? []),
        ...selectedFiles,
      ]
      const allSelectedAttachments = [
        ...(form.getValues('attachments') ?? []),
        ...attachments,
      ]
      form.setValue('files', allSelectedFiles)
      form.setValue('attachments', allSelectedAttachments)
    },
    [form, selectAttachmentsDialog]
  )

  const handleRemoveAttachment = React.useCallback(
    async (attachment: DocumentAttachment) => {
      const deleteDocumentAttachmentsPromise =
        deleteDocumentAttachmentsMutation.mutateAsync({
          params: {
            path: {
              documentId: Number(documentId),
            },
          },
          body: {
            attachmentIds: [attachment.id!],
          },
        })

      toast.promise(deleteDocumentAttachmentsPromise, {
        loading: `Removing attachment "${attachment.fileName}"...`,
        success: () => {
          const remain = uploadedAttachments.filter(
            (att) => att.id !== attachment.id
          )
          form.setValue('attachments', remain)
          return `Attachment "${attachment.fileName}" removed successfully!`
        },
        error: `Failed to remove attachment "${attachment.fileName}"`,
      })
    },
    [uploadedAttachments, form]
  )

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
            <CardTitle>Edit Document</CardTitle>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                id='edit-document-form'
                onSubmit={form.handleSubmit(onSubmit)}
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
                                            onClick={() => {
                                              handleOpenPreview(file)
                                            }}
                                          >
                                            <Eye />
                                          </DataTableActionBarAction>
                                          <FileUploadItemDelete
                                            asChild
                                            type='button'
                                            onClick={() =>
                                              handleRemoveAttachment(
                                                uploadedAttachments[index]
                                              )
                                            }
                                          >
                                            <DataTableActionBarAction
                                              size='icon'
                                              tooltip='Remove file'
                                              type='button'
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
          <div className='bg-background sticky bottom-0 z-10 flex items-center justify-end space-x-2 border-t px-2 pt-2'>
            <Button variant='outline' size='lg' type='button'>
              Save as Draft
            </Button>
            <Button form='edit-document-form' type='submit' size='lg'>
              Save Document
            </Button>
          </div>
        </Card>
      </div>
    </>
  )
}
