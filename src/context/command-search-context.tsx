import React from 'react'
import { CommandMenu } from '@/components/command-menu'

interface CommandSearchContextType {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CommandSearchContext =
  React.createContext<CommandSearchContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export function CommandSearchProvider({ children }: Props) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => {
      document.removeEventListener('keydown', down)
    }
  }, [])

  return (
    <CommandSearchContext.Provider value={{ open, setOpen }}>
      {children}
      <CommandMenu />
    </CommandSearchContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCommandSearch = () => {
  const commandSearchContext = React.useContext(CommandSearchContext)

  if (!commandSearchContext) {
    throw new Error(
      'useCommandSearch has to be used within <CommandSearchProvider>'
    )
  }

  return commandSearchContext
}
