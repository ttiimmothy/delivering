'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Alert, AlertDescription } from '../../components/ui/Alert';
import { loginSchema, type LoginFormData } from '../../schemas/forms';
import Link from 'next/link';
import {FormField} from "../../components/forms/FormField";
import {FormSubmitButton} from "../../components/forms/FormSubmitButton";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, loginError } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      router.push('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              register={register}
              error={errors.email}
              required
            />
            
            <FormField
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              register={register}
              error={errors.password}
              required
            />
            
            {loginError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {loginError.message || 'Login failed. Please try again.'}
                </AlertDescription>
              </Alert>
            )}
            
            <FormSubmitButton
              isLoading={isLoading || isSubmitting}
              className="w-full"
            >
              Sign in
            </FormSubmitButton>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
            </span>
            <Link href="/register" className="text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}