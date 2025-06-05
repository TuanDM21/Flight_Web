import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TasksRoute } from '@/routes/_authenticated/tasks'
import { FileUser, Users } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/context/auth'
import { useDataTable } from '@/hooks/use-data-table'
import { AppDialogInstance } from '@/hooks/use-dialog-instance'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { AppConfirmDialog } from '@/components/app-confirm-dialog'
import { AppDialog } from '@/components/app-dialog'
import { AppSheet } from '@/components/app-sheet'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { useUpdateTaskAssignment } from '@/features/tasks/hooks/use-update-task-assignment'
import { updateTaskAssignmentSchema } from '@/features/tasks/schema'
import {
  Task,
  TaskAssignment,
  TaskAssignmentStatus,
} from '@/features/tasks/types'
import { taskStatusLabels } from '@/features/tasks/utils'
import { useCreateTaskAssignmentsMutation } from '../hooks/use-create-task-assignments'
import { useTaskAssignments } from '../hooks/use-task-assignments'
import { useCreateAssignmentColumns } from './assignment-columns'
import { AssignmentDataTable } from './assignment-data-table'
import DeleteTaskAssignmentConfirmDialog from './delete-task-assignment-confirm-dialog'
import { TaskAssignmentCommentsSheet } from './task-assignment-comments-sheet'
import { TaskAssignmentFormSheet } from './task-assignment-form-sheet'

type TaskAssignmentUpdateForm = z.infer<typeof updateTaskAssignmentSchema> & {
  assignmentId?: number
}

interface ViewAssignmentDialogContentProps {
  taskId: number
  dialog: AppDialogInstance
  task: Task
}

const initialFormValues: TaskAssignmentUpdateForm = {
  recipientType: '',
  recipientId: 0,
  status: 'ASSIGNED',
  note: '',
  dueAt: new Date().toISOString(),
}

export function ViewAssignmentDialog({
  taskId,
  dialog,
  task,
}: ViewAssignmentDialogContentProps) {
  const searchParams = TasksRoute.useSearch()
  const currentType = searchParams.type || 'assigned'
  const { user } = useAuth()

  const isTaskOwner = user?.id === task.createdByUser?.id

  const updateAssignmentMutation = useUpdateTaskAssignment(taskId, currentType)
  const { data: assignments, isLoading: isLoadingAssignments } =
    useTaskAssignments(taskId)

  const [selectedAssignment, setSelectedAssignment] =
    useState<TaskAssignment | null>(null)
  const [commentsAssignment, setCommentsAssignment] =
    useState<TaskAssignment | null>(null)

  const form = useForm<TaskAssignmentUpdateForm>({
    resolver: zodResolver(updateTaskAssignmentSchema),
    defaultValues: initialFormValues,
  })
  const deleteAssignmentDialogInstance = AppConfirmDialog.useDialog()
  const commentsSheetDialogInstance = AppSheet.useDialog()
  const createAssignmentSheetDialogInstance = AppSheet.useDialog()

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
      loading: 'Updating assignment...',
      success: () => {
        resetAssignmentForm()
        return 'Assignment updated successfully!'
      },
      error: 'Failed to update assignment. Please try again.',
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
      loading: `Updating assignment status...`,
      success: `Assignment status updated to ${taskStatusLabels[newStatus]}!`,
      error: `Failed to update assignment status. Please try again.`,
    })
  }

  const handleDeleteAssignment = (assignment: TaskAssignment) => {
    setSelectedAssignment(assignment)
    deleteAssignmentDialogInstance.open()
  }

  const assignmentColumns = useCreateAssignmentColumns({
    editingAssignmentId,
    form,
    task,
    handleSaveEdit,
    resetAssignmentForm,
    handleUpdateAssignmentStatus,
    setCommentsAssignment,
    commentsSheetDialogInstance,
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

  const handleOpenCreateAssignmentSheet = () => {
    createAssignmentSheetDialogInstance.open()
  }

  return (
    <>
      {selectedAssignment && (
        <DeleteTaskAssignmentConfirmDialog
          taskId={taskId}
          assignment={selectedAssignment}
          onSuccess={() => {
            setSelectedAssignment(null)
          }}
          dialog={deleteAssignmentDialogInstance}
        />
      )}

      {commentsAssignment && commentsSheetDialogInstance.isOpen && (
        <TaskAssignmentCommentsSheet
          assignmentId={commentsAssignment.assignmentId!}
          dialog={commentsSheetDialogInstance}
        />
      )}

      {createAssignmentSheetDialogInstance.isOpen && (
        <TaskAssignmentFormSheet
          taskId={taskId}
          dialog={createAssignmentSheetDialogInstance}
        />
      )}

      <AppDialog dialog={dialog}>
        <DialogContent
          className='max-h-7xl flex flex-col sm:max-w-7xl'
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(event) => event.preventDefault()}
        >
          <DialogHeader className='pb-4'>
            <DialogTitle>Assignments for Task #{taskId}</DialogTitle>
            <p className='text-muted-foreground mt-1 text-sm'>
              View all assignments for this task
            </p>
          </DialogHeader>

          <div className='flex justify-end gap-2'>
            {!noAssignments && isTaskOwner && (
              <Button
                className='space-x-1'
                onClick={handleOpenCreateAssignmentSheet}
              >
                <span>Create Assignment</span> <FileUser />
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
                    No assignments yet
                  </h3>
                  {isTaskOwner && (
                    <>
                      <Button
                        className='space-x-1'
                        onClick={handleOpenCreateAssignmentSheet}
                      >
                        <span>Create Assignment</span> <FileUser />
                      </Button>
                      <p className='text-muted-foreground max-w-sm text-sm'>
                        Be the first to create an assignment for this task.
                      </p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <AssignmentDataTable table={assignmentsTable} user={user} />
            )}
          </Form>
        </DialogContent>
      </AppDialog>
    </>
  )
}
