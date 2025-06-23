import { z } from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import SignInPage from '@/features/auth/sign-in'

const fallback = '/'

export const Route = createFileRoute('/(auth)/sign-in')({
  component: SignInPage,
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback })
    }
  },
})
