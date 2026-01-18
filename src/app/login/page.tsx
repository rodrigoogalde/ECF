import React, { Suspense } from 'react';
import { LoginForm } from '../../components/login/loginForm';
import Loading from '@/components/loading';

export default async function Page() {
  return (
    <div className="flex  w-full h-screen items-center justify-center">
        <Suspense fallback={<Loading />}>
          <LoginForm />
        </Suspense>
    </div>
  );
}