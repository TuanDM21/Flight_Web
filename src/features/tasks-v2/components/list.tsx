'use client'

import { useState } from 'react'
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  rectIntersection,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  ChevronDown,
  ChevronRight,
  Plus,
  MoreHorizontal,
  MessageSquare,
  User,
  Calendar,
  Flag,
  GripVertical,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Mock data
const mockTasks: Task[] = [
  {
    id: '1',
    name: 'Task 2',
    status: 'COMPLETE' as const,
    assignee: null,
    dueDate: null,
    priority: null,
    comments: 0,
    subtasks: [],
  },
  {
    id: '2',
    name: 'Công việc',
    status: 'IN_PROGRESS' as const,
    assignee: null,
    dueDate: null,
    priority: null,
    comments: 0,
    subtasks: [
      {
        id: '2-1',
        name: 'Subtask 1',
        status: 'IN_PROGRESS' as const,
        assignee: 'JD',
        dueDate: '2025-07-01',
        priority: 'HIGH' as const,
        comments: 2,
      },
    ],
  },
  {
    id: '3',
    name: 'Task 3',
    status: 'TO_DO' as const,
    assignee: null,
    dueDate: null,
    priority: null,
    comments: 0,
    subtasks: [],
  },
  {
    id: '4',
    name: 'Design Homepage Layout',
    status: 'IN_PROGRESS' as const,
    assignee: 'AB',
    dueDate: '2025-07-15',
    priority: 'HIGH' as const,
    comments: 5,
    subtasks: [
      {
        id: '4-1',
        name: 'Create wireframes',
        status: 'COMPLETE' as const,
        assignee: 'AB',
        dueDate: '2025-07-10',
        priority: 'MEDIUM' as const,
        comments: 1,
      },
      {
        id: '4-2',
        name: 'Design mockups',
        status: 'IN_PROGRESS' as const,
        assignee: 'CD',
        dueDate: '2025-07-12',
        priority: 'HIGH' as const,
        comments: 3,
      },
    ],
  },
  {
    id: '5',
    name: 'Implement Authentication',
    status: 'TO_DO' as const,
    assignee: 'EF',
    dueDate: '2025-08-01',
    priority: 'HIGH' as const,
    comments: 0,
    subtasks: [],
  },
  {
    id: '6',
    name: 'Setup Database',
    status: 'COMPLETE' as const,
    assignee: 'GH',
    dueDate: '2025-06-30',
    priority: 'HIGH' as const,
    comments: 8,
    subtasks: [],
  },
  {
    id: '7',
    name: 'API Development',
    status: 'IN_PROGRESS' as const,
    assignee: 'IJ',
    dueDate: '2025-07-20',
    priority: 'MEDIUM' as const,
    comments: 12,
    subtasks: [
      {
        id: '7-1',
        name: 'User endpoints',
        status: 'COMPLETE' as const,
        assignee: 'IJ',
        dueDate: '2025-07-05',
        priority: 'HIGH' as const,
        comments: 4,
      },
      {
        id: '7-2',
        name: 'Product endpoints',
        status: 'IN_PROGRESS' as const,
        assignee: 'KL',
        dueDate: '2025-07-15',
        priority: 'MEDIUM' as const,
        comments: 2,
      },
      {
        id: '7-3',
        name: 'Order endpoints',
        status: 'TO_DO' as const,
        assignee: null,
        dueDate: '2025-07-25',
        priority: 'LOW' as const,
        comments: 0,
      },
    ],
  },
  {
    id: '8',
    name: 'Testing Framework Setup',
    status: 'TO_DO' as const,
    assignee: 'MN',
    dueDate: '2025-08-15',
    priority: 'MEDIUM' as const,
    comments: 1,
    subtasks: [],
  },
  {
    id: '9',
    name: 'Mobile Responsive Design',
    status: 'TO_DO' as const,
    assignee: null,
    dueDate: '2025-08-30',
    priority: 'LOW' as const,
    comments: 0,
    subtasks: [],
  },
  {
    id: '10',
    name: 'Performance Optimization',
    status: 'COMPLETE' as const,
    assignee: 'OP',
    dueDate: '2025-06-25',
    priority: 'MEDIUM' as const,
    comments: 15,
    subtasks: [
      {
        id: '10-1',
        name: 'Image optimization',
        status: 'COMPLETE' as const,
        assignee: 'OP',
        dueDate: '2025-06-20',
        priority: 'HIGH' as const,
        comments: 3,
      },
      {
        id: '10-2',
        name: 'Code splitting',
        status: 'COMPLETE' as const,
        assignee: 'QR',
        dueDate: '2025-06-22',
        priority: 'MEDIUM' as const,
        comments: 5,
      },
    ],
  },
  {
    id: '11',
    name: 'Documentation Writing',
    status: 'IN_PROGRESS' as const,
    assignee: 'ST',
    dueDate: '2025-09-01',
    priority: 'LOW' as const,
    comments: 7,
    subtasks: [],
  },
  {
    id: '12',
    name: 'Security Audit',
    status: 'TO_DO' as const,
    assignee: null,
    dueDate: '2025-09-15',
    priority: 'HIGH' as const,
    comments: 0,
    subtasks: [],
  },
  {
    id: '13',
    name: 'User Interface Redesign',
    status: 'TO_DO' as const,
    assignee: 'UV',
    dueDate: '2025-10-01',
    priority: 'MEDIUM' as const,
    comments: 3,
    subtasks: [
      {
        id: '13-1',
        name: 'Color scheme update',
        status: 'TO_DO' as const,
        assignee: 'WX',
        dueDate: '2025-09-20',
        priority: 'LOW' as const,
        comments: 1,
      },
      {
        id: '13-2',
        name: 'Component library update',
        status: 'TO_DO' as const,
        assignee: 'YZ',
        dueDate: '2025-09-25',
        priority: 'HIGH' as const,
        comments: 2,
      },
    ],
  },
  {
    id: '14',
    name: 'Performance Monitoring',
    status: 'IN_PROGRESS' as const,
    assignee: 'AA',
    dueDate: '2025-08-20',
    priority: 'HIGH' as const,
    comments: 8,
    subtasks: [],
  },
  {
    id: '15',
    name: 'Code Review Process',
    status: 'COMPLETE' as const,
    assignee: 'BB',
    dueDate: '2025-06-15',
    priority: 'MEDIUM' as const,
    comments: 12,
    subtasks: [],
  },
  {
    id: '16',
    name: 'DevOps Pipeline',
    status: 'IN_PROGRESS' as const,
    assignee: 'CC',
    dueDate: '2025-08-10',
    priority: 'HIGH' as const,
    comments: 6,
    subtasks: [
      {
        id: '16-1',
        name: 'CI/CD setup',
        status: 'IN_PROGRESS' as const,
        assignee: 'DD',
        dueDate: '2025-08-05',
        priority: 'HIGH' as const,
        comments: 4,
      },
      {
        id: '16-2',
        name: 'Docker configuration',
        status: 'COMPLETE' as const,
        assignee: 'EE',
        dueDate: '2025-07-30',
        priority: 'MEDIUM' as const,
        comments: 2,
      },
    ],
  },
  {
    id: '17',
    name: 'Error Handling Improvement',
    status: 'TO_DO' as const,
    assignee: null,
    dueDate: '2025-09-30',
    priority: 'MEDIUM' as const,
    comments: 0,
    subtasks: [],
  },
  {
    id: '18',
    name: 'Accessibility Compliance',
    status: 'TO_DO' as const,
    assignee: 'FF',
    dueDate: '2025-10-15',
    priority: 'HIGH' as const,
    comments: 5,
    subtasks: [],
  },
  {
    id: '19',
    name: 'Data Migration',
    status: 'COMPLETE' as const,
    assignee: 'GG',
    dueDate: '2025-06-20',
    priority: 'HIGH' as const,
    comments: 18,
    subtasks: [],
  },
  {
    id: '20',
    name: 'Backup Strategy',
    status: 'IN_PROGRESS' as const,
    assignee: 'HH',
    dueDate: '2025-08-25',
    priority: 'HIGH' as const,
    comments: 4,
    subtasks: [],
  },
]

const statusConfig = {
  COMPLETE: {
    label: 'COMPLETE',
    color: 'bg-emerald-500 hover:bg-emerald-600',
    textColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    icon: '✓',
  },
  IN_PROGRESS: {
    label: 'IN PROGRESS',
    color: 'bg-blue-500 hover:bg-blue-600',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
    icon: '◐',
  },
  TO_DO: {
    label: 'TO DO',
    color: 'bg-slate-500 hover:bg-slate-600',
    textColor: 'text-slate-600',
    bgColor: 'bg-slate-50 dark:bg-slate-950/30',
    borderColor: 'border-slate-200 dark:border-slate-800',
    icon: '○',
  },
}

const priorityConfig = {
  HIGH: {
    label: 'High',
    color:
      'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800',
    dotColor: 'bg-red-500',
  },
  MEDIUM: {
    label: 'Medium',
    color:
      'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800',
    dotColor: 'bg-amber-500',
  },
  LOW: {
    label: 'Low',
    color:
      'bg-green-100 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800',
    dotColor: 'bg-green-500',
  },
}

interface Task {
  id: string
  name: string
  status: keyof typeof statusConfig
  assignee?: string | null
  dueDate?: string | null
  priority?: keyof typeof priorityConfig | null
  comments: number
  subtasks?: Task[]
}

interface StatusGroupProps {
  status: keyof typeof statusConfig
  tasks: Task[]
  expanded: boolean
  onToggle: () => void
}

function DroppableStatusGroup({
  status,
  children,
}: {
  status: keyof typeof statusConfig
  children: React.ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'transition-all duration-200',
        isOver && 'scale-[1.02] opacity-90'
      )}
    >
      {children}
    </div>
  )
}

function StatusGroup({ status, tasks, expanded, onToggle }: StatusGroupProps) {
  const config = statusConfig[status]
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())

  const toggleTaskExpansion = (taskId: string) => {
    const newExpanded = new Set(expandedTasks)
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId)
    } else {
      newExpanded.add(taskId)
    }
    setExpandedTasks(newExpanded)
  }

  return (
    <DroppableStatusGroup status={status}>
      <div className='space-y-2'>
        {/* Status Header */}
        <div
          className={`flex items-center gap-3 rounded-xl border-2 px-4 py-2 transition-all duration-200 ${config.bgColor} ${config.borderColor}`}
        >
          <Button
            variant='ghost'
            size='sm'
            className='h-5 w-5 p-0 hover:bg-white/80 dark:hover:bg-black/20'
            onClick={onToggle}
          >
            {expanded ? (
              <ChevronDown className='h-3.5 w-3.5' />
            ) : (
              <ChevronRight className='h-3.5 w-3.5' />
            )}
          </Button>

          <div className='flex items-center gap-2'>
            <Badge
              variant='secondary'
              className={`${config.color} border-0 text-xs font-semibold text-white shadow-sm`}
            >
              <span className='mr-1.5'>{config.icon}</span>
              {config.label}
            </Badge>
            <span className='text-muted-foreground bg-muted/50 rounded-full px-2 py-0.5 text-xs font-medium'>
              {tasks.length}
            </span>
          </div>

          <div className='ml-auto flex items-center gap-1'>
            <Button
              variant='ghost'
              size='sm'
              className='h-7 w-7 p-0 hover:bg-white/80 dark:hover:bg-black/20'
            >
              <MoreHorizontal className='text-muted-foreground h-3.5 w-3.5' />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='text-muted-foreground hover:text-foreground h-7 gap-1.5 px-2 text-xs font-medium hover:bg-white/80 dark:hover:bg-black/20'
            >
              <Plus className='h-3.5 w-3.5' />
              Add Task
            </Button>
          </div>
        </div>

        {/* Tasks Table */}
        {expanded && (
          <div className='ml-6 space-y-1'>
            {/* Table Header */}
            <div className='border-border/50 text-muted-foreground grid grid-cols-12 gap-4 border-b pb-2 text-xs font-semibold tracking-wider'>
              <div className='col-span-4'>Task Name</div>
              <div className='col-span-2'>Assignee</div>
              <div className='col-span-2'>Due Date</div>
              <div className='col-span-1'>Priority</div>
              <div className='col-span-1'>Comments</div>
            </div>

            {/* Task Rows */}
            {tasks.map((task) => (
              <div key={task.id} className='space-y-2'>
                <TaskRowWithDrag
                  task={task}
                  level={0}
                  expanded={expandedTasks.has(task.id)}
                  onToggle={() => {
                    toggleTaskExpansion(task.id)
                  }}
                />
                {/* Subtasks */}
                {expandedTasks.has(task.id) &&
                  task.subtasks?.map((subtask) => (
                    <div
                      key={subtask.id}
                      className='border-muted/80 ml-8 rounded-md border-l-2 pl-4'
                    >
                      <div className='relative'>
                        <TaskRowWithDrag task={subtask} level={1} />
                      </div>
                    </div>
                  ))}
              </div>
            ))}

            {/* Add Task Row */}
            <div className='group hover:bg-muted/20 grid grid-cols-12 gap-4 py-3 text-sm transition-all duration-200'>
              <div className='col-span-4 flex items-center gap-2 px-2'>
                <Plus className='text-muted-foreground group-hover:text-foreground h-4 w-4' />
                <span className='text-muted-foreground group-hover:text-foreground font-medium'>
                  Add new task
                </span>
              </div>
              <div className='col-span-8'></div>
            </div>
          </div>
        )}
      </div>
    </DroppableStatusGroup>
  )
}

interface TaskRowProps {
  task: Task
  level?: number
  expanded?: boolean
  onToggle?: () => void
}

function TaskRowWithDrag({
  task,
  level = 0,
  expanded,
  onToggle,
}: TaskRowProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn('transition-all duration-200', isDragging && 'opacity-50')}
    >
      <TaskRow
        task={task}
        level={level}
        expanded={expanded}
        onToggle={onToggle}
        dragAttributes={attributes}
        dragListeners={listeners}
      />
    </div>
  )
}

function TaskRow({
  task,
  level = 0,
  expanded,
  onToggle,
  dragAttributes,
  dragListeners,
}: TaskRowProps & {
  dragAttributes?: any
  dragListeners?: any
}) {
  const taskStatusConfig = {
    COMPLETE: { icon: '✓', color: 'text-emerald-600', label: 'COMPLETE' },
    IN_PROGRESS: { icon: '◐', color: 'text-blue-600', label: 'IN PROGRESS' },
    TO_DO: { icon: '○', color: 'text-slate-600', label: 'TO DO' },
  }

  const hasSubtasks = task.subtasks && task.subtasks.length > 0

  return (
    <div
      className={`group hover:bg-muted/20 grid grid-cols-12 gap-4 py-3 text-sm transition-all duration-200 ${
        level > 0 ? 'px-4' : 'px-2'
      }`}
    >
      {/* Name */}
      <div className='col-span-4 flex items-center gap-2'>
        {/* Drag Handle */}
        <div
          className='cursor-grab opacity-0 transition-opacity group-hover:opacity-60 hover:opacity-100'
          {...dragListeners}
          {...dragAttributes}
        >
          <GripVertical className='text-muted-foreground h-4 w-4' />
        </div>

        {hasSubtasks && (
          <Button
            variant='ghost'
            size='sm'
            className='h-5 w-5 p-0 opacity-60 hover:opacity-100'
            onClick={onToggle}
          >
            {expanded ? (
              <ChevronDown className='h-3 w-3' />
            ) : (
              <ChevronRight className='h-3 w-3' />
            )}
          </Button>
        )}
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full ${taskStatusConfig[task.status].color} bg-current/10 font-semibold`}
        >
          <span className='text-xs'>{taskStatusConfig[task.status].icon}</span>
        </div>
        <span className='text-foreground font-medium'>{task.name}</span>
        {hasSubtasks && (
          <Badge variant='outline' className='h-5 px-1.5 text-xs font-medium'>
            {task.subtasks!.length}
          </Badge>
        )}
      </div>

      {/* Assignee */}
      <div className='col-span-2 flex items-center'>
        {task.assignee ? (
          <div className='flex items-center gap-2'>
            <Avatar className='h-6 w-6 border'>
              <AvatarFallback className='text-xs font-semibold'>
                {task.assignee}
              </AvatarFallback>
            </Avatar>
            <span className='text-muted-foreground text-xs'>
              {task.assignee}
            </span>
          </div>
        ) : (
          <Button
            variant='ghost'
            size='sm'
            className='text-muted-foreground hover:text-foreground h-6 w-16 justify-start px-2 text-xs'
          >
            <User className='mr-1 h-3 w-3' />
            Assign
          </Button>
        )}
      </div>

      {/* Due Date */}
      <div className='col-span-2 flex items-center'>
        {task.dueDate ? (
          <div className='bg-muted/50 flex items-center gap-1.5 rounded-md px-2 py-1'>
            <Calendar className='text-muted-foreground h-3 w-3' />
            <span className='text-xs font-medium'>{task.dueDate}</span>
          </div>
        ) : (
          <Button
            variant='ghost'
            size='sm'
            className='text-muted-foreground hover:text-foreground h-6 w-20 justify-start px-2 text-xs'
          >
            <Calendar className='mr-1 h-3 w-3' />
            Set date
          </Button>
        )}
      </div>

      {/* Priority */}
      <div className='col-span-1 flex items-center'>
        {task.priority ? (
          <Badge
            variant='secondary'
            className={`border text-xs font-semibold ${priorityConfig[task.priority].color}`}
          >
            <div
              className={`mr-1.5 h-2 w-2 rounded-full ${priorityConfig[task.priority].dotColor}`}
            ></div>
            {priorityConfig[task.priority].label}
          </Badge>
        ) : (
          <Button
            variant='ghost'
            size='sm'
            className='text-muted-foreground hover:text-foreground h-6 w-12 justify-start px-2 text-xs'
          >
            <Flag className='h-3 w-3' />
          </Button>
        )}
      </div>

      {/* Comments */}
      <div className='col-span-1 flex items-center'>
        {task.comments > 0 ? (
          <div className='bg-muted/50 flex items-center gap-1 rounded-md px-2 py-1'>
            <MessageSquare className='text-muted-foreground h-3 w-3' />
            <span className='text-xs font-medium'>{task.comments}</span>
          </div>
        ) : (
          <Button
            variant='ghost'
            size='sm'
            className='text-muted-foreground hover:text-foreground h-6 w-8 p-0 opacity-0 group-hover:opacity-100'
          >
            <MessageSquare className='h-3 w-3' />
          </Button>
        )}
      </div>
    </div>
  )
}

export function List() {
  const [tasks, setTasks] = useState(mockTasks)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(['COMPLETE', 'IN_PROGRESS', 'TO_DO'])
  )
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const toggleGroup = (status: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(status)) {
      newExpanded.delete(status)
    } else {
      newExpanded.add(status)
    }
    setExpandedGroups(newExpanded)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = active.data.current?.task as Task
    setActiveTask(task)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null)
    const { active, over } = event

    if (!over) return

    const draggedTaskId = active.id as string
    const newStatus = over.id as keyof typeof statusConfig

    // Update task status
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === draggedTaskId) {
          return { ...task, status: newStatus }
        }
        // Also update subtasks
        if (task.subtasks) {
          const updatedSubtasks = task.subtasks.map((subtask) =>
            subtask.id === draggedTaskId
              ? { ...subtask, status: newStatus }
              : subtask
          )
          return { ...task, subtasks: updatedSubtasks }
        }
        return task
      })
    )
  }

  // Group tasks by status with proper task-subtask ordering
  const groupedTasks = Object.keys(statusConfig).reduce(
    (acc, status) => {
      const orderedTasks: Task[] = []

      // Get parent tasks for this status
      const parentTasks = tasks.filter((task) => task.status === status)

      // For each parent task, add it and its subtasks in order
      for (const parentTask of parentTasks) {
        orderedTasks.push(parentTask)

        // Add subtasks that belong to this parent and have the same status
        if (parentTask.subtasks) {
          const statusSubtasks = parentTask.subtasks.filter(
            (subtask) => subtask.status === status
          )
          orderedTasks.push(...statusSubtasks)
        }
      }

      // Also add orphaned subtasks (subtasks whose parent is in different status)
      const allSubtasks = tasks.flatMap((task) => task.subtasks || [])
      const orphanedSubtasks = allSubtasks.filter((subtask) => {
        const parentTask = tasks.find((task) =>
          task.subtasks?.some((sub) => sub.id === subtask.id)
        )
        return (
          subtask.status === status &&
          parentTask &&
          parentTask.status !== status
        )
      })
      orderedTasks.push(...orphanedSubtasks)

      acc[status as keyof typeof statusConfig] = orderedTasks
      return acc
    },
    {} as Record<keyof typeof statusConfig, Task[]>
  )

  return (
    <div className='flex h-full flex-1 flex-col overflow-hidden'>
      <div className='flex-1 space-y-4 overflow-y-auto p-6'>
        <DndContext
          collisionDetection={rectIntersection}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          {Object.entries(groupedTasks).map(([status, statusTasks]) => (
            <StatusGroup
              key={status}
              status={status as keyof typeof statusConfig}
              tasks={statusTasks}
              expanded={expandedGroups.has(status)}
              onToggle={() => {
                toggleGroup(status)
              }}
            />
          ))}
          <DragOverlay>
            {activeTask && (
              <div className='bg-background rounded-lg border shadow-xl ring-2 ring-blue-500/20'>
                <TaskRow task={activeTask} />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}
