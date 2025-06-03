import { AppRoles, RoleActions, RoleMeta } from './types'

export const permissionsMatrix: Record<
  RoleActions,
  {
    allowedFrom: AppRoles[]
    allowedTarget: AppRoles[]
  }
> = {
  assign_task: {
    allowedFrom: ['admin', 'DIRECTOR', 'UNIT_LEAD'],
    allowedTarget: ['TEAM_LEAD', 'MEMBER'],
  },
  deactivate_user: {
    allowedFrom: ['admin', 'DIRECTOR'],
    allowedTarget: ['MEMBER', 'TEAM_VICE_LEAD'],
  },
  view_profile: {
    allowedFrom: ['admin', 'MEMBER'],
    allowedTarget: ['admin', 'MEMBER'],
  },
}

export const rolesMeta: Record<AppRoles, RoleMeta> = {
  admin: {
    level: 0,
    permissions: {
      all: ['manage'],
    },
  },
  DIRECTOR: {
    level: 1,
    permissions: {
      tasks: ['manage'],
    },
  },
  VICE_DIRECTOR: {
    level: 2,
    permissions: {},
  },
  TEAM_LEAD: {
    level: 3,
    permissions: {
      tasks: ['read'],
    },
  },
  TEAM_VICE_LEAD: {
    level: 4,
    permissions: {},
  },
  UNIT_LEAD: {
    level: 5,
    permissions: {},
  },
  UNIT_VICE_LEAD: {
    level: 6,
    permissions: {
      tasks: ['create', 'read', 'update'],
    },
  },
  OFFICE: {
    level: 7,
    permissions: {},
  },
  MEMBER: {
    level: 7,
    permissions: {
      tasks: ['read'],
    },
  },
  GUEST: {
    level: -1,
    permissions: {
      auth: ['read'],
    },
  },
}
