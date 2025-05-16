import { paths } from '@/generated/api-schema'

export type Task = NonNullable<
  paths['/api/tasks']['get']['responses']['200']['content']['*/*']['data']
>[number]

export type TaskFilters = Omit<Task, 'assignments' | 'documents'>

export type TaskAssignment = Required<Task>['assignments'][number]

export type TaskDocument = Required<Task>['documents'][number]

export type TaskAssignmentStatus = Required<TaskAssignment['status']>
