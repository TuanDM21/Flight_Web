import React, { HTMLAttributes } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useRouter, useRouterState } from '@tanstack/react-router'
import { Route } from '@/routes/(auth)/sign-in'
import { loginSchema } from '@/schemas/auth'
import { LoginCredentials } from '@/types/auth'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/auth'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

type SignInFormProps = HTMLAttributes<HTMLFormElement>

export function SignInForm({ className, ...props }: SignInFormProps) {
  const auth = useAuth()
  const isLoading = useRouterState({ select: (s) => s.isLoading })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const navigate = useNavigate()

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'nmhungify@gmail.com',
      password: 'Abcd@123',
      remember: false,
    },
  })

  async function onSubmit(data: LoginCredentials) {
    setIsSubmitting(true)
    try {
      await auth.login(data)

      await navigate({ to: '/tasks' })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLoggingIn = isLoading || isSubmitting

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={form.formState.isSubmitting}>
          {isLoggingIn ? 'Loading...' : 'Login'}
        </Button>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
        </div>
      </form>
    </Form>
  )
}
