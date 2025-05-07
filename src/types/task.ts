import { paths } from '@/generated/api-schema'

export type Task =
  paths['/api/tasks']['get']['responses']['200']['content']['*/*'][number]

export type TaskAssignment = Required<Task>['assignments'][number]

export type TaskAssignmentStatus = NonNullable<TaskAssignment['status']>
