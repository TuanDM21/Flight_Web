import { createFileRoute } from '@tanstack/react-router'
import SignOutPage from '@/features/auth/sign-out'

export const Route = createFileRoute('/(auth)/sign-out')({
  component: SignOutPage,
})
