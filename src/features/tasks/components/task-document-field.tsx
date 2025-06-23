import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Link } from '@tanstack/react-router'
import { IconTableShare } from '@tabler/icons-react'
import { Eye, FileText, Trash } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AppDialog } from '@/components/app-dialog'
import { DataTableActionBarAction } from '@/components/data-table/data-table-action-bar'
import { TaskDocumentAttachmentField } from '@/features/tasks/components/task-document-attachment-field'
import { TaskDocument } from '@/features/tasks/types'
import { CreateTasksForm } from '../create'
import { SelectDocumentsDialog } from './select-documents-dialog'

export function TaskDocumentField() {
  const form = useFormContext<CreateTasksForm>()
  const selectDocumentDialogInstance = AppDialog.useDialog()
  const [selectedDocuments, setSelectedDocuments] = useState<TaskDocument[]>([])

  const getSelectedDocumentIds = () => {
    return form.getValues('documentIds') || []
  }

  const handleSelectedDocuments = (documents: TaskDocument[]) => {
    const selectedDocumentIds = documents.map((doc) => doc.id).filter(Boolean)
    setSelectedDocuments(documents)
    form.setValue('documentIds', selectedDocumentIds as number[])
    selectDocumentDialogInstance.close()
  }

  const handleRemoveDocument = (documentId: number) => {
    const currentDocumentIds = form.getValues('documentIds') || []
    const updatedDocumentIds = currentDocumentIds.filter(
      (id) => id !== documentId
    )
    const updatedDocuments = selectedDocuments.filter(
      (doc) => doc.id !== documentId
    )

    form.setValue('documentIds', updatedDocumentIds)
    setSelectedDocuments(updatedDocuments)
  }

  return (
    <>
      {selectDocumentDialogInstance.isOpen && (
        <SelectDocumentsDialog
          getSelectedDocumentIds={getSelectedDocumentIds}
          onSubmit={handleSelectedDocuments}
          dialog={selectDocumentDialogInstance}
        />
      )}

      <FormField
        control={form.control}
        name='documentIds'
        render={() => (
          <FormItem>
            <FormLabel>Tài liệu</FormLabel>
            <FormControl>
              <Tabs defaultValue='existing' className='w-full'>
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger value='existing'>
                    Chọn tài liệu có sẵn
                  </TabsTrigger>
                  <TabsTrigger value='create'>Tạo tài liệu mới</TabsTrigger>
                </TabsList>

                <TabsContent value='existing' className='space-y-4'>
                  <div className='border-primary/30 bg-background relative flex flex-col items-center rounded-lg border-2 border-dashed p-4 font-medium transition-colors'>
                    <Button
                      type='button'
                      variant='outline'
                      className='flex min-h-20 w-full flex-col items-center rounded-lg border-2 border-dashed'
                      onClick={(evt) => {
                        evt.preventDefault()
                        evt.stopPropagation()
                        selectDocumentDialogInstance.open()
                      }}
                    >
                      <span className='flex items-center gap-2'>
                        <IconTableShare className='size-5' />
                        Chọn từ tài liệu được chia sẻ
                      </span>
                    </Button>
                    <div className='flex w-full flex-col items-center'>
                      <div className='w-full'>
                        {selectedDocuments.length > 0 && (
                          <>
                            <div className='my-4 flex w-full items-center gap-2'>
                              <div className='border-muted-foreground/30 flex-grow border-t'></div>
                            </div>
                            <div className='space-y-2'>
                              <div className='space-y-2'>
                                {selectedDocuments.map((document) => (
                                  <div
                                    key={document.id}
                                    className='flex items-center justify-between rounded-lg border p-3'
                                  >
                                    <div className='flex flex-1 items-center gap-3'>
                                      <div className='bg-primary/10 rounded-full p-2'>
                                        <FileText className='text-primary h-4 w-4' />
                                      </div>
                                      <div className='min-w-0 flex-1'>
                                        <div className='flex items-center gap-2'>
                                          <p className='truncate text-sm font-medium'>
                                            #{document.id}
                                          </p>
                                          {document.documentType && (
                                            <Badge
                                              variant='secondary'
                                              className='text-xs'
                                            >
                                              {document.documentType}
                                            </Badge>
                                          )}
                                        </div>
                                        {document.content && (
                                          <p className='text-muted-foreground truncate text-xs'>
                                            {document.content}
                                          </p>
                                        )}
                                        {document.attachments &&
                                          document.attachments.length > 0 && (
                                            <p className='text-muted-foreground text-xs'>
                                              {document.attachments.length} tệp
                                              đính kèm
                                            </p>
                                          )}
                                      </div>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                      <DataTableActionBarAction
                                        size='icon'
                                        tooltip='Xem tài liệu'
                                      >
                                        <Button
                                          variant='link'
                                          size='sm'
                                          asChild
                                          className='h-auto p-0'
                                        >
                                          <Link
                                            to='/documents/$document-id'
                                            params={{
                                              'document-id': String(
                                                document.id
                                              ),
                                            }}
                                            target='_blank'
                                          >
                                            <Eye className='h-4 w-4' />
                                          </Link>
                                        </Button>
                                      </DataTableActionBarAction>
                                      <DataTableActionBarAction
                                        size='icon'
                                        tooltip='Xóa tài liệu'
                                        onClick={(e) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          handleRemoveDocument(document.id!)
                                        }}
                                      >
                                        <Trash className='h-4 w-4' />
                                      </DataTableActionBarAction>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value='create' className='space-y-4'>
                  <TaskDocumentAttachmentField />
                </TabsContent>
              </Tabs>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
