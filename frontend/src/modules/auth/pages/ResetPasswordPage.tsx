import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { authApi } from '@/modules/auth/api/authApi'
import { useToast } from '@/hooks/use-toast'

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ['password_confirmation'],
})

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const email = searchParams.get('email')
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token || !email) {
      toast({
        variant: 'destructive',
        title: 'Invalid request',
        description: 'Missing reset token or email',
      })
      return
    }

    setIsLoading(true)
    try {
      await authApi.resetPassword(token, email, data.password, data.password_confirmation)
      toast({
        title: 'Password reset!',
        description: 'Your password has been reset successfully',
      })
      navigate('/login')
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast({
        variant: 'destructive',
        title: 'Reset failed',
        description: err.response?.data?.message || 'Unable to reset password',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!token || !email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Invalid Link</CardTitle>
            <CardDescription>
              This password reset link is invalid or expired
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/forgot-password">Request new reset link</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Reset password</CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirm Password</Label>
              <Input
                id="password_confirmation"
                type="password"
                placeholder="Confirm new password"
                {...register('password_confirmation')}
                disabled={isLoading}
              />
              {errors.password_confirmation && (
                <p className="text-sm text-red-500">{errors.password_confirmation.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset password'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
