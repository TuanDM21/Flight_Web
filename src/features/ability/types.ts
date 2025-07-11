import { PureAbility } from '@casl/ability'

export type AppActions = 'create' | 'read' | 'update' | 'delete' | 'manage'

export type AppSubjects = 'auth' | 'tasks' | 'documents' | 'attachments' | 'all'

export type RoleActions = 'assign_task' | 'view_profile' | 'deactivate_user'

export type AllActions = AppActions | RoleActions

export type AppRoles =
  | 'admin'
  | 'DIRECTOR'
  | 'VICE_DIRECTOR'
  | 'UNIT_LEAD'
  | 'UNIT_VICE_LEAD'
  | 'TEAM_LEAD'
  | 'TEAM_VICE_LEAD'
  | 'OFFICE'
  | 'MEMBER'
  | 'GUEST'

export type AppAbility = PureAbility<[AllActions, AppSubjects]> & {
  findReason: (
    action: AllActions,
    subject: AppSubjects,
    inverted?: boolean
  ) => string
}

export type RolePermissions = Partial<Record<AppSubjects, AppActions[]>>

export type RoleMeta = {
  level: number
  permissions: RolePermissions
}
