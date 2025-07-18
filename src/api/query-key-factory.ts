export const taskKeysFactory = {
  lists: () => ['get', '/api/tasks'] as const,
  listAssignees: (filterType = 'created') =>
    [
      'get',
      '/api/tasks/my',
      { params: { query: { type: filterType } } },
    ] as const,

  detail: (id: number) =>
    ['get', '/api/tasks/{id}', { params: { path: { id: id } } }] as const,

  assignments: (taskId: number) =>
    [
      'get',
      '/api/assignments/task/{taskId}',
      { params: { path: { taskId: taskId } } },
    ] as const,

  assignmentComments: (assignmentId: number) =>
    [
      'get',
      '/api/assignments/{id}/comments',
      { params: { path: { id: assignmentId } } },
    ] as const,

  documents: (taskId: number) =>
    [
      'get',
      '/api/task-documents',
      { params: { query: { taskId: taskId } } },
    ] as const,
}

export const flightKeysFactory = {
  lists: () => ['get', '/api/flights'] as const,
  detail: (id: number) =>
    ['get', '/api/flights/{id}', { params: { path: { id: id } } }] as const,
  search: (query: { date?: string; keyword?: string }) =>
    ['get', '/api/flights/search', { params: { query } }] as const,
  today: () => ['get', '/api/flights/today'] as const,
}

export const userKeysFactory = {
  me: ['get', '/api/users/me'] as const,
  list: () => ['get', '/api/users'] as const,
}

export const documentKeysFactory = {
  lists: () => ['get', '/api/documents'] as const,
  detail: (id: number) =>
    ['get', '/api/documents/{id}', { params: { path: { id } } }] as const,
  documentAttachmentsDownloadUrl: (attachmentId: number) =>
    [
      'get',
      '/api/attachments/download-url/{attachmentId}',
      { params: { path: { attachmentId: attachmentId } } },
    ] as const,
}

export const attachmentKeysFactory = {
  myAttachments: () => ['get', '/api/attachments/my-files'] as const,
  detail: (id: number) =>
    ['get', '/api/attachments/{id}', { params: { path: { id } } }] as const,
  sharedWithMe: () => ['get', '/api/attachments/shared-with-me'] as const,
  usersSharedWithAttachments: (attachmentId: number) =>
    [
      'get',
      '/api/attachments/{attachmentId}/shares',
      { params: { path: { attachmentId } } },
    ] as const,
  accessibleFiles: () => ['get', '/api/attachments/accessible-files'] as const,
}
