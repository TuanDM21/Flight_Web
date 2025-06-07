import * as React from 'react'

export const WindowContext = React.createContext<Window | undefined>(undefined)
export function WindowProvider({ children }: { children: React.ReactNode }) {
  const value = React.useMemo(() => {
    return typeof window !== 'undefined' ? window : undefined
  }, [])

  return (
    <WindowContext.Provider value={value}>{children}</WindowContext.Provider>
  )
}
