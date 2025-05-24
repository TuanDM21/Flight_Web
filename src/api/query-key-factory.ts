export const taskKeysFactory = {
  lists: () => ['get', '/api/tasks'] as const,
  listsFilter: (filters: string) =>
    [...taskKeysFactory.lists(), { filters }] as const,

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
    ['get', '/api/task-documents', { params: { query: { taskId } } }] as const,
}

export const userKeysFactory = {
  me: ['get', '/api/users/me', {}] as const,
}

export const documentKeysFactory = {
  lists: () => ['get', '/api/documents', {}] as const,
}
