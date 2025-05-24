import React, { useState } from 'react'
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

  openComments: boolean
  setOpenComments: React.Dispatch<React.SetStateAction<boolean>>

  openSelectDocuments: boolean
  setOpenSelectDocuments: React.Dispatch<React.SetStateAction<boolean>>

  currentTaskId: number | null
  setCurrentTaskId: React.Dispatch<React.SetStateAction<number | null>>

  currentAssignmentId: number | null
  setCurrentAssignmentId: React.Dispatch<React.SetStateAction<number | null>>

  currentDocumentId: number | null
  setCurrentDocumentId: React.Dispatch<React.SetStateAction<number | null>>

  selectedDocumentIds: number[]
  setSelectedDocumentIds: React.Dispatch<React.SetStateAction<number[]>>
}

const TasksContext = React.createContext<TasksContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function TasksProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<TasksDialogType>(null)
  const [openComments, setOpenComments] = useState(false)
  const [openSelectDocuments, setOpenSelectDocuments] = useState(false)

  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null)
  const [currentAssignmentId, setCurrentAssignmentId] = useState<number | null>(
    null
  )
  const [currentDocumentId, setCurrentDocumentId] = useState<number | null>(
    null
  )
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<number[]>([])

  return (
    <TasksContext.Provider
      value={{
        open,
        setOpen,
        openComments,
        setOpenComments,

        openSelectDocuments,
        setOpenSelectDocuments,

        currentTaskId,
        setCurrentTaskId,

        currentAssignmentId,
        setCurrentAssignmentId,

        currentDocumentId,
        setCurrentDocumentId,

        selectedDocumentIds,
        setSelectedDocumentIds,
      }}
    >
      {children}
    </TasksContext.Provider>
  )
}

export const useTasks = () => {
  const tasksContext = React.useContext(TasksContext)

  if (!tasksContext) {
    throw new Error('useTasks has to be used within <TasksContext>')
  }

  return tasksContext
}
