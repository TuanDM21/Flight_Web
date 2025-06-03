import { useContext } from 'react'
import { AbilityContext } from '@/features/ability/context/ability'
import { AllActions, AppSubjects } from '@/features/ability/types'

export function useAbility() {
  const context = useContext(AbilityContext)
  if (!context) {
    throw new Error('useAbility must be used within a AbilityProvider')
  }
  const findReason = (
    action: AllActions,
    subject: AppSubjects,
    inverted = true
  ) => {
    const rules = context.rules.filter((rule) => rule.inverted === inverted)
    const foundRule = rules.find(
      (rule) => rule.action === action && rule.subject === subject
    )

    return foundRule?.reason || 'Default reason'
  }
  context.findReason = findReason

  return context
}
