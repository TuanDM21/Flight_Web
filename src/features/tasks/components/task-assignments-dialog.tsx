import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TasksRoute } from '@/routes/_authenticated/tasks'
import { FileUser, Users } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/context/auth-context'
import { useDataTable } from '@/hooks/use-data-table'
import { DialogProps, useDialogs } from '@/hooks/use-dialogs'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { useUpdateTaskAssignment } from '@/features/tasks/hooks/use-update-task-assignment'
import { updateTaskAssignmentSchema } from '@/features/tasks/schema'
import {
  Task,
  TaskAssignment,
  TaskAssignmentStatus,
} from '@/features/tasks/types'
import { allTaskAssignmentStatusLabels } from '@/features/tasks/utils/tasks'
import { useCreateTaskAssignmentsMutation } from '../hooks/use-create-task-assignments'
import { useDeleteTaskAssignmentMutation } from '../hooks/use-delete-task-assignment'
import { useTaskAssignments } from '../hooks/use-task-assignments'
import { AssignmentDataTable } from './assignment-data-table'
import { useAssignmentTableColumns } from './assignment-table-columns'
import { TaskAssignmentCommentsSheet } from './task-assignment-comments-sheet'
import { TaskAssignmentFormSheet } from './task-assignment-form-sheet'

type TaskAssignmentUpdateForm = z.infer<typeof updateTaskAssignmentSchema> & {
  assignmentId?: number
}

interface TaskAssignmentsDialogProps {
  task: Task
}

const initialFormValues: TaskAssignmentUpdateForm = {
  recipientType: '',
  recipientId: 0,
  status: 'ASSIGNED',
  note: '',
  dueAt: new Date().toISOString(),
}

export function TaskAssignmentsDialog({
  payload,
  open,
  onClose,
}: DialogProps<TaskAssignmentsDialogProps>) {
  const { task } = payload

  const taskId = task.id!
  const searchParams = TasksRoute.useSearch()
  const currentType = searchParams.type || 'assigned'
  const { user } = useAuth()
  const dialogs = useDialogs()

  const isTaskOwner = user?.id === task.createdByUser?.id

  const updateAssignmentMutation = useUpdateTaskAssignment(taskId, currentType)
  const { data: assignments, isLoading: isLoadingAssignments } =
    useTaskAssignments(taskId)

  const form = useForm<TaskAssignmentUpdateForm>({
    resolver: zodResolver(updateTaskAssignmentSchema),
    defaultValues: initialFormValues,
  })

  const editingAssignmentId = form.watch('assignmentId')

  const resetAssignmentForm = () => {
    form.reset({
      assignmentId: undefined,
      ...initialFormValues,
    })
  }

  const startEditing = (assignment: TaskAssignment) => {
    form.reset({
      recipientType: assignment.recipientType || '',
      recipientId: assignment.recipientId,
      status: assignment.status ?? 'ASSIGNED',
      note: assignment.note || '',
      dueAt: assignment.dueAt || '',
      assignmentId: assignment.assignmentId,
    })
  }

  const handleSaveEdit = async () => {
    const { assignmentId, ...restValues } = form.getValues()

    if (!assignmentId) {
      toast.error('Assignment ID is missing.')
      return
    }

    const isValid = await form.trigger()
    if (!isValid) return

    const updatePromise = updateAssignmentMutation.mutateAsync({
      params: {
        path: { id: assignmentId },
      },
      body: restValues,
    })
    toast.promise(updatePromise, {
      loading: 'Đang cập nhật phân công...',
      success: () => {
        resetAssignmentForm()
        return 'Cập nhật phân công thành công!'
      },
      error: 'Không thể cập nhật phân công. Vui lòng thử lại.',
    })
  }

  const handleUpdateAssignmentStatus = (
    assignment: TaskAssignment,
    newStatus: TaskAssignmentStatus
  ) => {
    const updatePromise = updateAssignmentMutation.mutateAsync({
      params: {
        path: { id: assignment.assignmentId || 0 },
      },
      body: {
        status: newStatus,
      },
    })
    toast.promise(updatePromise, {
      loading: `Đang cập nhật trạng thái phân công...`,
      success: `Assignment status updated to ${allTaskAssignmentStatusLabels[newStatus]}!`,
      error: `Không thể cập nhật trạng thái phân công. Vui lòng thử lại.`,
    })
  }

  const deleteAssignmentMutation = useDeleteTaskAssignmentMutation(taskId)

  const handleDeleteAssignment = async (assignment: TaskAssignment) => {
    const recipientName =
      assignment?.recipientUser?.name ||
      assignment?.recipientUser?.teamName ||
      assignment?.recipientUser?.unitName

    const confirmed = await dialogs.confirm(
      <div className='space-y-2'>
        <p className='text-muted-foreground text-sm'>
          You are about to delete the assignment for{' '}
          <span className='text-foreground font-medium'>{recipientName}</span>.
        </p>
        <p className='text-muted-foreground text-sm'>
          This will remove all comments and progress associated with this
          assignment.
        </p>
        <p className='text-muted-foreground text-sm font-medium'>
          This action cannot be undone.
        </p>
      </div>,
      {
        title: 'Delete Assignment',
        severity: 'error',
        okText: 'Delete Assignment',
        cancelText: 'Cancel',
      }
    )

    if (!confirmed || !assignment.assignmentId) return

    const deleteAssignmentPromise = deleteAssignmentMutation.mutateAsync({
      params: {
        path: {
          id: assignment.assignmentId,
        },
      },
    })

    toast.promise(deleteAssignmentPromise, {
      loading: 'Đang xóa phân công...',
      success: `Đã xóa thành công phân công cho ${recipientName}.`,
      error: 'Lỗi khi xóa phân công',
    })
  }

  const assignmentColumns = useAssignmentTableColumns({
    editingAssignmentId,
    form,
    task,
    handleSaveEdit,
    resetAssignmentForm,
    handleUpdateAssignmentStatus,
    handleOpenCommentsSheet: (assignment: TaskAssignment) => {
      dialogs.sheet(TaskAssignmentCommentsSheet, {
        assignmentId: assignment.assignmentId!,
      })
    },
    startEditing,
    handleDeleteAssignment,
    updateAssignmentMutation,
  })

  const { table: assignmentsTable } = useDataTable({
    data: assignments?.data ?? [],
    columns: assignmentColumns,
    pageCount: 1,
  })

  const taskAssignmentsMutation = useCreateTaskAssignmentsMutation()

  const noAssignments = !assignments?.data || assignments.data.length === 0

  const handleOpenCreateAssignmentSheet = async () => {
    await dialogs.sheet(TaskAssignmentFormSheet, { taskId })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={() => onClose()}>
        <DialogContent
          className='max-h-7xl flex flex-col sm:max-w-7xl'
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Phân công cho Task #{taskId}</DialogTitle>
          </DialogHeader>

          <div className='flex justify-end gap-2'>
            {!noAssignments && isTaskOwner && (
              <Button
                className='space-x-1'
                onClick={handleOpenCreateAssignmentSheet}
              >
                <span>Tạo phân công</span> <FileUser />
              </Button>
            )}
          </div>
          <Form {...form}>
            {isLoadingAssignments || taskAssignmentsMutation.isPending ? (
              <DataTableSkeleton
                columnCount={5}
                rowCount={5}
                withViewOptions={false}
              />
            ) : noAssignments ? (
              <div className='flex h-full flex-col items-center justify-center space-y-4 py-8'>
                <div className='bg-muted rounded-full p-4'>
                  <Users className='text-muted-foreground h-8 w-8' />
                </div>
                <div className='space-y-2 text-center'>
                  <h3 className='text-muted-foreground text-lg font-medium'>
                    Chưa có phân công nào
                  </h3>
                  {isTaskOwner && (
                    <>
                      <Button
                        className='space-x-1'
                        onClick={handleOpenCreateAssignmentSheet}
                      >
                        <span>Tạo phân công</span> <FileUser />
                      </Button>
                      <p className='text-muted-foreground max-w-sm text-sm'>
                        Hãy là người đầu tiên tạo phân công cho task này.
                      </p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <AssignmentDataTable table={assignmentsTable} />
            )}
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
