import { createContext, useEffect, useState } from 'react'
import { AppAbility } from '@/features/ability/types'
import { useAuth } from '../../../context/auth'
import buildAbilityFor from '../lib'

export const AbilityContext = createContext<AppAbility>(undefined!)
AbilityContext.displayName = 'AbilityContext'

interface AbilityProviderProps {
  children: React.ReactNode
}
export default function AbilityProvider({ children }: AbilityProviderProps) {
  const { user } = useAuth()
  const [ability, setAbility] = useState(buildAbilityFor('guest'))

  useEffect(() => {
    if (!user?.roleName) return

    setAbility(buildAbilityFor(user?.roleName))
  }, [user?.roleName])

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  )
}
