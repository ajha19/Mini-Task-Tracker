'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Mail, Lock, User } from 'lucide-react';

export default function SignupPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/signup', data);
      login(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
        <CardDescription>
          Enter your details to get started with Task Tracker
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            icon={User}
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message as string}
          />

          <Input
            label="Email"
            type="email"
            placeholder="name@example.com"
            icon={Mail}
            autoComplete="email"
            {...register('email', { required: 'Email is required' })}
            error={errors.email?.message as string}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            autoComplete="new-password"
            {...register('password', { required: 'Password is required' })}
            error={errors.password?.message as string}
          />

          {error && (
            <div className="p-3 text-sm text-destructive bg-red-50 rounded-md border border-red-100">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" isLoading={loading}>
            Create account
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
