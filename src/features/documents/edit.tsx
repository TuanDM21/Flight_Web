import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { EditDocumentRoute } from '@/routes/_authenticated/documents/$document-id/edit'
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateDocument } from './hooks/use-update-document'
import { getDocumentDetailQueryOptions } from './hooks/use-view-document-detail'
import { createDocumentSchema } from './schema'
import { CreateDocumentForm } from './types'

export default function EditDocumentPage() {
  const documentId = EditDocumentRoute.useParams()['document-id']
  const { data: documentDetailsQuery } = useSuspenseQuery(
    getDocumentDetailQueryOptions(Number(documentId))
  )
  const currentDocument = documentDetailsQuery?.data || {}

  const navigate = useNavigate()
  const updateDocumentMutation = useUpdateDocument()

  const form = useForm<CreateDocumentForm>({
    resolver: zodResolver(createDocumentSchema),
    defaultValues: {
      documentType: currentDocument.documentType || '',
      content: currentDocument.content || '',
      notes: currentDocument.notes || '',
      attachmentIds:
        currentDocument.attachments?.map((attachment) => attachment.id) || [],
      files: [],
    },
  })

  const onSubmit = async (data: CreateDocumentForm) => {
    console.log('### handleSubmit called with data:', data)
    // const { files, ...requestData } = data

    // const documentUpdatePromise = updateDocumentMutation.mutateAsync({
    //   params: {
    //     path: {
    //       id: Number(documentId),
    //     },
    //   },
    //   body: requestData,
    // })

    // toast.promise(documentUpdatePromise, {
    //   loading: `Updating document #${documentId}...`,
    //   success: () => {
    //     void navigate({ to: '/documents' })
    //     return `Document #${documentId} updated successfully!`
    //   },
    //   error: `Failed to update document #${documentId}`,
    // })
  }

  return (
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
            </form>
          </Form>
        </CardContent>
        <div className='bg-background sticky bottom-0 z-10 flex items-center justify-end space-x-2 border-t px-2 pt-2'>
          <Button
            variant='outline'
            size='lg'
            form='edit-document-form'
            type='button'
          >
            Save as Draft
          </Button>
          <Button form='edit-document-form' type='submit' size='lg'>
            Save Task
          </Button>
        </div>
      </Card>
    </div>
  )
}
