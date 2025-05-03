import { useLayoutEffect, useNavigate, useRouter } from '@tanstack/react-router'
import { useAuth } from '@/context/auth'

export default function SignOutPage() {
  const router = useRouter()
  const { logout } = useAuth()
  const navigate = useNavigate()
  useLayoutEffect(() => {
    const performLogout = async () => {
      logout()
      await navigate({ to: '/sign-in' })
      await router.invalidate()
      void navigate({ to: '/' })
    }

    void performLogout()
  }, [logout, navigate, router])

  return null
}
