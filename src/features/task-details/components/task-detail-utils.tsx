interface Assignment {
  status?: string
}

interface Document {
  attachments?: Array<{
    fileName?: string
    fileSize?: number
  }>
}

interface Task {
  assignments?: Assignment[]
  documents?: Document[]
}

export const getAssignmentsInfo = (task?: Task) => {
  if (!task?.assignments || task.assignments.length === 0) {
    return { count: 0, completed: 0, statuses: [] }
  }

  const completed = task.assignments.filter(
    (assignment) =>
      assignment.status === 'COMPLETED' ||
      assignment.status === 'LATE_COMPLETED'
  ).length

  const statuses = [
    ...new Set(
      task.assignments
        .map((assignment) => assignment.status)
        .filter((status) => status !== undefined)
    ),
  ]

  return {
    count: task.assignments.length,
    completed,
    statuses,
  }
}

export const getDocumentsInfo = (
  task?: Task,
  getFileType?: (fileName: string) => string
) => {
  if (!task?.documents || task.documents.length === 0) {
    return { count: 0, totalAttachments: 0, totalSize: 0, types: [] }
  }

  const totalAttachments = task.documents.reduce(
    (sum, doc) => sum + (doc.attachments?.length || 0),
    0
  )

  const totalSize = task.documents.reduce(
    (sum, doc) =>
      sum +
      (doc.attachments?.reduce(
        (attachSum, att) => attachSum + (att.fileSize || 0),
        0
      ) || 0),
    0
  )

  const types = getFileType
    ? [
        ...new Set(
          task.documents.flatMap(
            (doc) =>
              doc.attachments?.map((att) => getFileType(att.fileName || '')) ||
              []
          )
        ),
      ]
    : []

  return {
    count: task.documents.length,
    totalAttachments,
    totalSize,
    types,
  }
}
