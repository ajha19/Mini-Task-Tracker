'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, logout, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const isJustLoggedIn = useRef(false);

  // Auto-logout if user visits login page while authenticated
  // But skip if we just logged in (to prevent immediate logout loop)
  useEffect(() => {
    if (user && !isJustLoggedIn.current) {
      logout();
    }
  }, [user, logout]);

  const [error, setError] = useState('');

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', data);
      isJustLoggedIn.current = true;
      login(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
      setLoading(false);
    } 
    // Do not set loading false on success to avoid UI flicker before redirect
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
        <CardDescription>
          Enter your email to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            icon={Mail}
            {...register('email', { required: 'Email is required' })}
            error={errors.email?.message as string}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            icon={Lock}
            {...register('password', { required: 'Password is required' })}
            error={errors.password?.message as string}
          />

          {error && (
            <div className="p-3 text-sm text-destructive bg-red-50 rounded-md border border-red-100">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" isLoading={loading}>
            Sign in
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-primary hover:text-primary/80 transition-colors">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
