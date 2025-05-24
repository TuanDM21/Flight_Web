import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCreateDocument } from './hooks/use-create-document'
import { useUploadAttachments } from './hooks/use-upload-attachments'
import { createDocumentSchema } from './schema'
import { CreateDocumentForm } from './types'

export default function CreateDocumentPage() {
  const navigate = useNavigate()
  const createDocumentMutation = useCreateDocument()
  const uploadAttachmentsMutation = useUploadAttachments()

  const form = useForm<CreateDocumentForm>({
    resolver: zodResolver(createDocumentSchema),
    defaultValues: {
      attachmentIds: [],
      content: '',
      documentType: '',
      notes: '',
      files: [],
    },
  })

  const handleSubmit = async (data: CreateDocumentForm) => {
    try {
      let attachmentIds: number[] = []

      // Upload files first if any files are selected
      if (data.files && data.files.length > 0) {
        try {
          const formData = new FormData()
          data.files.forEach((file) => {
            formData.append('files', file)
          })

          const uploadResult = await uploadAttachmentsMutation.mutateAsync({
            body: formData,
          })

          // Extract attachment IDs from the upload response
          if (uploadResult.data && uploadResult.data.length > 0) {
            attachmentIds = uploadResult.data
              .map((attachment) => attachment.id!)
              .filter((id) => id !== undefined)

            // Log the uploaded files info for debugging
            console.log(
              'Uploaded files:',
              uploadResult.data.map((att) => ({
                id: att.id,
                fileName: att.fileName,
                filePath: att.filePath, // This is the URL
                fileSize: att.fileSize,
              }))
            )

            toast.success(
              `Successfully uploaded ${uploadResult.data.length} file(s)`
            )
          } else {
            toast.warning('Files uploaded but no attachment IDs received')
          }
        } catch (uploadError) {
          console.error('File upload failed:', uploadError)
          toast.error('Failed to upload files. Please try again.')
          return // Don't proceed with document creation if file upload fails
        }
      }

      // Create document with attachment IDs
      const createDocumentPromise = createDocumentMutation.mutateAsync({
        body: {
          documentType: data.documentType,
          content: data.content,
          notes: data.notes,
          attachmentIds: attachmentIds,
        },
      })

      toast.promise(createDocumentPromise, {
        loading: `Creating document...`,
        success: `Document created successfully!`,
        error: `Failed to create document. Please try again.`,
      })

      await createDocumentPromise
      void navigate({ to: '/documents' })
    } catch (error) {
      console.error('Error during document creation:', error)
      toast.error('Failed to create document. Please try again.')
    }
  }

  return (
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
                      <FileUpload
                        value={field.value}
                        onValueChange={field.onChange}
                        accept='image/*'
                        maxFiles={2}
                        maxSize={5 * 1024 * 1024}
                        onFileReject={(_, message) => {
                          form.setError('files', {
                            message,
                          })
                        }}
                        multiple
                      >
                        <FileUploadDropzone>
                          <div className='flex flex-col items-center gap-1 text-center'>
                            <div className='flex items-center justify-center rounded-full border p-2.5'>
                              <Upload className='text-muted-foreground size-6' />
                            </div>
                            <p className='text-sm font-medium'>
                              Drag & drop images here
                            </p>
                            <p className='text-muted-foreground text-xs'>
                              Or click to browse (max 2 files, up to 4MB each)
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
  )
}
