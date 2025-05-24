import $queryClient from '@/api'

export function useRecipientOptions() {
  const getTeamQuery = $queryClient.useQuery('get', '/api/teams')
  const getUnitsQuery = $queryClient.useQuery('get', '/api/units')
  const getUsersQuery = $queryClient.useQuery('get', '/api/users')

  const getRecipientOptions = (type: string) => {
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

  return {
    getTeamQuery,
    getUnitsQuery,
    getUsersQuery,
    getRecipientOptions,
  }
}

export const RECIPIENT_TYPES = [
  { label: 'User', value: 'user' },
  { label: 'Team', value: 'team' },
  { label: 'Unit', value: 'unit' },
]
