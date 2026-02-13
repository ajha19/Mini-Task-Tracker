'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

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
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Create your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Full Name"
          type="text"
          {...register('name', { required: 'Name is required' })}
          error={errors.name?.message as string}
        />

        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          {...register('email', { required: 'Email is required' })}
          error={errors.email?.message as string}
        />

        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          {...register('password', { required: 'Password is required' })}
          error={errors.password?.message as string}
        />

        {error && <p className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">{error}</p>}

        <Button type="submit" className="w-full" isLoading={loading}>
          Sign up
        </Button>
      </form>
    </div>
  );
}
