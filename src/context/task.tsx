import React, { useState } from 'react'
import { Task, TaskAssignment, TaskDocument } from '@/types/task'
import useDialogState from '@/hooks/use-dialog-state'

type TasksDialogType =
  | 'create'
  | 'update'
  | 'delete'
  | 'import'
  | 'view-assignment'
  | 'view-document'
  | 'delete-assignment'
  | 'delete-document'

interface TasksContextType {
  open: TasksDialogType | null
  setOpen: (str: TasksDialogType | null) => void
  currentRow: Task | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Task | null>>

  currentAssignmentRow: TaskAssignment | null
  setCurrentAssignmentRow: React.Dispatch<
    React.SetStateAction<TaskAssignment | null>
  >

  currentDocumentRow: TaskDocument | null
  setCurrentDocumentRow: React.Dispatch<
    React.SetStateAction<TaskDocument | null>
  >
}

const TasksContext = React.createContext<TasksContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function TasksProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<TasksDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Task | null>(null)
  const [currentAssignmentRow, setCurrentAssignmentRow] =
    useState<TaskAssignment | null>(null)
  const [currentDocumentRow, setCurrentDocumentRow] =
    useState<TaskDocument | null>(null)

  return (
    <TasksContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
        currentAssignmentRow,
        setCurrentAssignmentRow,
        currentDocumentRow,
        setCurrentDocumentRow,
      }}
    >
      {children}
    </TasksContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTasks = () => {
  const tasksContext = React.useContext(TasksContext)

  if (!tasksContext) {
    throw new Error('useTasks has to be used within <TasksContext>')
  }

  return tasksContext
}
