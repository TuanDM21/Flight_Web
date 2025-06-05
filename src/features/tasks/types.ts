import { z } from 'zod'
import { paths } from '@/generated/api-schema'
import { createTaskAssignmentsSchema } from './schema'

export type Task = NonNullable<
  paths['/api/tasks']['get']['responses']['200']['content']['*/*']['data']
>[number]

export type TaskFilters = Omit<Task, 'assignments' | 'documents'>

export type TaskAssignment = Required<Task>['assignments'][number]

export type TaskDocument = Required<Task>['documents'][number]

export type TaskAssignmentStatus = NonNullable<TaskAssignment['status']>

export type TaskDocumentAttachment = NonNullable<
  TaskDocument['attachments']
>[number]

export type CreateTaskAssignments = z.infer<typeof createTaskAssignmentsSchema>

export type TaskAssignmentComment = Required<
  NonNullable<
    paths['/api/assignments/{id}/comments']['get']['responses']['200']['content']['*/*']['data']
  >
>[number]

export type TaskFilterTypes = 'created' | 'assigned' | 'received'
