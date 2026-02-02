'use client';

import { useSearchParams } from 'next/navigation';
import { loginAction } from './actions';
import { useTransition, Suspense } from 'react';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

// TODO AUTH 4: Create the Login UI
// We use a simple form with two buttons to simulate different user roles.
function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [isPending, startTransition] = useTransition();

  const handleLogin = (role: 'admin' | 'user') => {
    startTransition(async () => {
      await loginAction(role, callbackUrl);
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-4 text-white">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-zinc-900 p-8 text-center shadow-xl ring-1 ring-white/10">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-zinc-400">Select a role to continue</p>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          {/* Button for User Role */}
          <button
            onClick={() => handleLogin('user')}
            disabled={isPending}
            className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-all hover:bg-blue-500 disabled:opacity-50"
          >
            {isPending ? 'Signing in...' : 'Sign in as User'}
          </button>

          {/* Button for Admin Role */}
          <button
            onClick={() => handleLogin('admin')}
            disabled={isPending}
            className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white transition-all hover:bg-emerald-500 disabled:opacity-50"
          >
            {isPending ? 'Signing in...' : 'Sign in as Admin'}
          </button>
        </div>

        <p className="text-xs text-zinc-500">
          This is a mock authentication demo. No password required.
        </p>
      </div>
    </div>
  );
}
