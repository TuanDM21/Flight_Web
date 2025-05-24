import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
import clsx from 'clsx'
import { PlusCircle, X } from 'lucide-react'
import { useTasks } from '@/context/task'
import { Button } from '@/components/ui/button'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { TaskDocument } from '@/features/tasks/types'
import { CreateTasksForm } from '../create'
import { SelectDocumentDialog } from './select-document-dialog'

export function TaskDocumentField() {
  const form = useFormContext<CreateTasksForm>()
  const { openSelectDocuments, setOpen, setOpenSelectDocuments } = useTasks()
  const [selectedDocuments, setSelectedDocuments] = useState<TaskDocument[]>([])

  return (
    <div className='space-y-4'>
      <SelectDocumentDialog
        open={openSelectDocuments}
        onOpenChange={(value) => {
          setOpenSelectDocuments(value)
        }}
        getSelectedDocumentIds={() => []}
      />
      <div className='flex items-center justify-between'>
        <FormLabel className='text-base font-medium dark:text-gray-200'>
          Documents
        </FormLabel>
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='flex items-center gap-1 dark:border-gray-700 dark:hover:bg-gray-800/50'
          onClick={() => setOpen('create')}
        >
          <PlusCircle className='h-4 w-4' />
          <span>Add Document</span>
        </Button>
      </div>

      <div className='rounded-md'>
        <FormField
          control={form.control}
          name={`documentIds`}
          render={() => {
            return (
              <div
                role='list'
                className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
              >
                {selectedDocuments?.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name='documentIds'
                    render={() => {
                      const currentAttachments = item.attachments || []
                      const totalFiles = currentAttachments.length
                      const documentId = String(item.id ?? 'N/A')

                      return (
                        <FormItem
                          key={item.id}
                          className={clsx(
                            'border-l-primary bg-accent dark:bg-accent/20 col-span-1 flex divide-y divide-gray-200 overflow-hidden rounded-lg border border-l-4 border-gray-200 p-4 shadow-sm dark:divide-gray-700 dark:border-gray-700'
                          )}
                        >
                          <FormControl className='flex w-full flex-col'>
                            <div className='ml-3 flex flex-1 flex-col items-start'>
                              <div className='flex w-full items-center justify-between'>
                                <FormLabel
                                  htmlFor={documentId}
                                  className={clsx(
                                    'text-primary dark:text-primary text-sm font-medium break-words'
                                  )}
                                >
                                  {documentId}
                                </FormLabel>
                                <div className='mt-2 flex items-center space-x-2'>
                                  <Button
                                    variant='ghost'
                                    size='sm'
                                    className='flex items-center gap-1 dark:border-gray-700 dark:hover:bg-gray-800/50'
                                    onClick={() => {
                                      const updatedDocuments =
                                        selectedDocuments.filter(
                                          (doc) => doc.id !== item.id
                                        )
                                      const updatedDocumentIds =
                                        updatedDocuments.map(
                                          (doc) => doc.id
                                        ) as number[]
                                      form.setValue(
                                        'documentIds',
                                        updatedDocumentIds
                                      )
                                      setSelectedDocuments(updatedDocuments)
                                    }}
                                  >
                                    <X />
                                  </Button>
                                </div>
                              </div>
                              <div className='flex flex-wrap items-center gap-1'>
                                {totalFiles > 0 ? (
                                  <>
                                    {currentAttachments
                                      .slice(0, 2)
                                      .map((attachment, index) => (
                                        <div
                                          key={index}
                                          className='bg-muted inline-flex items-center rounded px-2 py-1 text-xs'
                                        >
                                          {attachment.fileName}
                                        </div>
                                      ))}
                                    {totalFiles > 2 && (
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            variant='ghost'
                                            size='sm'
                                            className='h-6 px-2 text-xs'
                                          >
                                            +{totalFiles - 2} tệp khác
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                          align='start'
                                          className='w-56'
                                        >
                                          <DropdownMenuLabel>
                                            Tất cả tệp đính kèm
                                          </DropdownMenuLabel>
                                          <DropdownMenuSeparator />
                                          {currentAttachments.map(
                                            (attachment, index) => (
                                              <DropdownMenuItem key={index}>
                                                {attachment.fileName}
                                              </DropdownMenuItem>
                                            )
                                          )}
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    )}
                                  </>
                                ) : (
                                  <span className='text-muted-foreground text-xs'>
                                    Không có tệp đính kèm
                                  </span>
                                )}
                              </div>
                            </div>
                          </FormControl>
                        </FormItem>
                      )
                    }}
                  />
                ))}
                <FormMessage />
              </div>
            )
          }}
        />
      </div>
    </div>
  )
}
