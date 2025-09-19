'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { FormField, PasswordField, MultiStepForm } from '../../components/forms'
import { registerSchema, type RegisterFormData } from '../../schemas/forms'

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  
  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    }
  })

  const { register, handleSubmit, formState: { errors } } = methods

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      setIsRegistered(true)
      
      // Redirect after 3 seconds
      setTimeout(() => {
        window.location.href = '/'
      }, 3000)
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialRegister = (provider: string) => {
    console.log(`Register with ${provider}`)
    // Implement social registration logic here
  }

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
            <p className="text-muted-foreground mb-4">
              Your account has been created. Redirecting you to login...
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const steps = [
    {
      title: 'Personal Information',
      description: 'Tell us about yourself',
      fields: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="firstName"
              label="First Name"
              placeholder="Enter your first name"
              register={register}
              error={errors.firstName}
              required
            />
            <FormField
              name="lastName"
              label="Last Name"
              placeholder="Enter your last name"
              register={register}
              error={errors.lastName}
              required
            />
          </div>
          <FormField
            name="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            register={register}
            error={errors.email}
            required
          />
          <FormField
            name="phone"
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number"
            register={register}
            error={errors.phone}
            required
          />
        </div>
      ),
    },
    {
      title: 'Account Security',
      description: 'Create a secure password',
      fields: (
        <div className="space-y-6">
          <PasswordField
            name="password"
            label="Password"
            placeholder="Create a strong password"
            register={register}
            error={errors.password}
            required
            showStrengthIndicator
          />
          <PasswordField
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            register={register}
            error={errors.confirmPassword}
            required
          />
        </div>
      ),
    },
    {
      title: 'Delivery Address',
      description: 'Where should we deliver your orders?',
      fields: (
        <div className="space-y-6">
          <FormField
            name="address"
            label="Street Address"
            placeholder="Enter your street address"
            register={register}
            error={errors.address}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="city"
              label="City"
              placeholder="Enter your city"
              register={register}
              error={errors.city}
              required
            />
            <FormField
              name="state"
              label="State"
              placeholder="Enter your state"
              register={register}
              error={errors.state}
              required
            />
          </div>
          <FormField
            name="zipCode"
            label="ZIP Code"
            placeholder="Enter your ZIP code"
            register={register}
            error={errors.zipCode}
            required
          />
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </Button>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-muted-foreground">
              Join our food delivery platform and start ordering today
            </p>
          </div>

          {/* Multi-Step Form */}
          <MultiStepForm
            steps={steps}
            onSubmit={onSubmit}
            isLoading={isLoading}
            formMethods={methods}
          />

          {/* Social Registration */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleSocialRegister('google')}
                className="w-full"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialRegister('facebook')}
                className="w-full"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}