import { Link } from '@tanstack/react-router'
import { Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDeleteTasksConfirm } from '@/features/tasks/hooks/use-delete-tasks-confirm'
import { Task } from '@/features/tasks/types'

interface TaskDetailHeaderProps {
  task: Task
}

export function TaskDetailHeader({ task }: TaskDetailHeaderProps) {
  const { onDeleteTasks } = useDeleteTasksConfirm('assigned')

  return (
    <div className='mb-4 flex items-center justify-between'>
      <div className='flex items-center space-x-4'>
        <div>
          <h1 className='text-2xl font-bold'>Nhiệm vụ #{task.id}</h1>
        </div>
      </div>

      <div className='flex items-center space-x-2'>
        <Button variant='outline' asChild className='space-x-1'>
          <Link
            to='/tasks/$task-id/edit'
            params={{
              'task-id': task.id!.toString(),
            }}
          >
            <Edit className='mr-2 h-4 w-4' />
            Chỉnh sửa
          </Link>
        </Button>
        <Button
          variant='destructive'
          className='space-x-1'
          onClick={() => onDeleteTasks([task])}
        >
          <Trash2 className='mr-2 h-4 w-4' />
          Xóa
        </Button>
      </div>
    </div>
  )
}
