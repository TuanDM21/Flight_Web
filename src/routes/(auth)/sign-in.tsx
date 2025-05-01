import { z } from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import SignIn from '@/features/auth/sign-in'

const fallback = '/' as const

export const Route = createFileRoute('/(auth)/sign-in')({
  component: SignIn,
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (context?.auth?.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback })
    }
  },
})
