import { useMemo } from 'react'
import $queryClient from '@/api'
import { LiteralUnion } from 'type-fest'
import { useAuth } from '@/context/auth-context'

export function useRecipientOptions() {
  const { user, hasRole } = useAuth()

  const getTeamQuery = $queryClient.useQuery('get', '/api/teams')
  const getUnitsQuery = $queryClient.useQuery('get', '/api/units', {
    params: {
      query: {
        teamId: user?.teamId,
      },
    },
  })
  const getUsersQuery = $queryClient.useQuery('get', '/api/users/assignable')

  const getRecipientOptions = (
    type: LiteralUnion<'team' | 'unit' | 'user', string>
  ) => {
    if (type === 'team') {
      return (
        (getTeamQuery.data?.data ?? []).map((team) => ({
          value: team.id,
          label: team.teamName,
        })) ?? []
      )
    }
    if (type === 'unit') {
      return (
        (getUnitsQuery.data?.data ?? []).map((unit) => ({
          value: unit.id,
          label: unit.unitName,
        })) ?? []
      )
    }
    return (
      (getUsersQuery.data?.data ?? []).map((user) => ({
        value: user.id,
        label: user.name,
      })) ?? []
    )
  }

  const deriveRecipientOptions = useMemo(() => {
    const userOption = { label: 'Cá nhân', value: 'user' }
    const teamOption = { label: 'Đội', value: 'team' }
    const unitOption = { label: 'Tổ', value: 'unit' }

    const higherRoles = ['ADMIN', 'DIRECTOR', 'VICE_DIRECTOR']
    if (higherRoles.some((role) => hasRole(role)))
      return [userOption, teamOption, unitOption]
    const mediumRoles = ['TEAM_VICE_LEAD', 'TEAM_LEAD']
    if (mediumRoles.some((role) => hasRole(role)))
      return [userOption, unitOption]
    return [userOption]
  }, [hasRole])

  return {
    getTeamQuery,
    getUnitsQuery,
    getUsersQuery,
    getRecipientOptions,
    deriveRecipientOptions,
  }
}
