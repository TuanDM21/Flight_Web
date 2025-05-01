import React, { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createFileRoute,
  redirect,
  useRouter,
  useRouterState,
} from '@tanstack/react-router'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import { toast } from 'sonner'
import { Icons } from '~/components/icons'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { useAuth } from '~/context/auth'
import { loginSchema } from '~/schemas/auth'
import { LoginCredentials } from '~/types/auth'

const fallback = '/' as const

export const Route = createFileRoute('/(auth)/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback })
    }
  },
  component: LoginPage,
})

export default function LoginPage() {
  const auth = useAuth()
  const isLoading = useRouterState({ select: (s) => s.isLoading })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const router = useRouter()
  const search = Route.useSearch()
  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'nmhungify@gmail.com',
      password: 'Abcd@123',
      remember: false,
    },
  })
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (data: LoginCredentials) => {
    setIsSubmitting(true)
    try {
      await auth.login(data)

      await router.navigate({ to: search.redirect || fallback })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLoggingIn = isLoading || isSubmitting

  return (
    <div className='bg-background text-foreground flex h-screen items-center justify-center'>
      <div className='mb- bg-card w-full max-w-md rounded p-8 shadow-md'>
        <div className='mb-10 flex flex-col items-center'>
          <Icons.logo className='text-primary h-12 w-12' />
          <h1 className='text-card-foreground mt-4 text-2xl font-bold'>
            Welcome Back!
          </h1>
          <p className='text-muted-foreground mt-2 text-sm'>
            Stay signed in and get special benefits.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Enter your password'
                        {...field}
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword((prev) => !prev)}
                        className='absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-500'
                      >
                        {showPassword ? (
                          <IconEyeOff size={20} />
                        ) : (
                          <IconEye size={20} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='remember'
              render={({ field }) => (
                <FormItem>
                  <div className='flex justify-between'>
                    <div className='flex items-center'>
                      <FormControl>
                        <Checkbox
                          id='remember'
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel htmlFor='remember' className='ml-2'>
                        Remember me
                      </FormLabel>
                    </div>
                    <div className='flex items-center justify-between'>
                      <a href='#' className='text-sm hover:underline'>
                        Forgot password?
                      </a>
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <Button
              type='submit'
              className='w-full'
              disabled={form.formState.isSubmitting}
            >
              {isLoggingIn ? 'Loading...' : 'Login'}
            </Button>
          </form>
        </Form>

        <p className='mt-4 text-center text-sm text-gray-600 dark:text-gray-400'>
          Don't have an account?
        </p>
      </div>
    </div>
  )
}
