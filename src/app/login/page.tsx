import React, { Suspense } from 'react';
import { LoginForm } from './loginForm';
import Loading from '@/src/components/loading';

export default async function Page() {
  return (
    <div className="flex  w-full h-screen items-center justify-center">
        <Suspense fallback={<Loading />}>
          <LoginForm />
        </Suspense>
    </div>
  );
}