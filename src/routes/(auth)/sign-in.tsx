import { z } from 'zod'
import { createFileRoute, redirect } from '@tanstack/react-router'
import SignInPage from '@/features/auth/sign-in'

const fallback = '/'

export const Route = createFileRoute('/(auth)/sign-in')({
  component: SignInPage,
  validateSearch: z.object({
    // eslint-disable-next-line unicorn/prefer-top-level-await
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect({ to: search.redirect || fallback })
    }
  },
})
