import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'

type DocumentDialogType = 'create' | 'update' | 'delete' | 'import'

interface DocumentContextType {
  open: DocumentDialogType | null
  setOpen: (str: DocumentDialogType | null) => void

  currentDocumentId: number | null
  setCurrentDocumentId: React.Dispatch<React.SetStateAction<number | null>>
}

const DocumentsContext = React.createContext<DocumentContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function DocumentsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<DocumentDialogType>(null)
  const [currentDocumentId, setCurrentDocumentId] = useState<number | null>(
    null
  )

  return (
    <DocumentsContext.Provider
      value={{
        open,
        setOpen,
        currentDocumentId,
        setCurrentDocumentId,
      }}
    >
      {children}
    </DocumentsContext.Provider>
  )
}

export const useDocuments = () => {
  const tasksContext = React.useContext(DocumentsContext)

  if (!tasksContext) {
    throw new Error('useTasks has to be used within <TasksContext>')
  }

  return tasksContext
}
