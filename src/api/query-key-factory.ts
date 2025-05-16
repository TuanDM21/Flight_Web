export const taskKeysFactory = {
  lists: () => ['get', '/api/tasks'] as const,
  listsFilter: (filters: string) =>
    [...taskKeysFactory.lists(), { filters }] as const,

  detail: (id: number) =>
    ['get', '/api/tasks/{id}', { params: { path: { id: id } } }] as const,
}

export const userKeysFactory = {
  me: ['get', '/api/users/me'] as const,
}
