import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
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
import { createTaskSchema } from '@/features/tasks/schema'
import { TaskAssignmentField } from './components/task-assignment-field'
import { TaskDocumentField } from './components/task-document-field'
import { useCreateTask } from './hooks/use-create-task'

export type CreateTasksForm = z.infer<typeof createTaskSchema>

export default function CreateTaskPage() {
  const navigate = useNavigate()
  const createTaskMutation = useCreateTask()

  const form = useForm({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      content: '',
      instructions: '',
      notes: '',
      assignments: [],
      documentIds: [],
      documents: [],
    },
  })

  const onSubmit = async (data: CreateTasksForm) => {
    try {
      const newDocuments =
        data.documents?.map((document) => ({
          documentType: document.documentType,
          content: document.content,
          notes: document.notes,
          attachmentIds: document.attachments?.map((att: any) => att.id) || [],
        })) || []

      // Filter out documents field and prepare the final payload
      const { documents, ...taskData } = data

      const createTaskPromise = createTaskMutation.mutateAsync({
        body: {
          ...taskData,
          newDocuments,
        },
      })

      toast.promise(createTaskPromise, {
        loading: `Đang tạo nhiệm vụ...`,
        success: `Tạo nhiệm vụ thành công!`,
        error: `Không thể tạo nhiệm vụ. Vui lòng thử lại.`,
      })

      await createTaskPromise
      void navigate({ to: '/tasks' })
    } catch (error) {
      console.error('Error creating task with documents:', error)
      toast.error('Có lỗi xảy ra khi tạo nhiệm vụ và tài liệu')
    }
  }

  return (
    <div className='px-4 py-2'>
      <Card className='py-4'>
        <CardHeader>
          <CardTitle>Tạo nhiệm vụ</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              id='tasks-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6'
            >
              <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel>Nội dung</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className='min-h-32'
                        placeholder='Nhập nội dung của bạn tại đây'
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
                    <FormLabel>Hướng dẫn</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className='min-h-32'
                        placeholder='Nhập hướng dẫn của bạn tại đây'
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
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className='min-h-32'
                        placeholder='Nhập ghi chú của bạn tại đây'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <TaskAssignmentField form={form} name={'assignments'} />
              <TaskDocumentField />
            </form>
          </Form>
        </CardContent>
        <div className='bg-background sticky bottom-0 z-10 flex items-center justify-end space-x-2 border-t px-2 pt-4'>
          <Button
            variant='outline'
            size='lg'
            onClick={() => void navigate({ to: '/tasks' })}
          >
            Lưu bản nháp
          </Button>
          <Button form='tasks-form' type='submit' size='lg'>
            Lưu nhiệm vụ
          </Button>
        </div>
      </Card>
    </div>
  )
}
