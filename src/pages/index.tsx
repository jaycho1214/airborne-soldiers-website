import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Layout, Spinner } from '@/components';
import { useAuth } from '@/hooks';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/signin');
    } else if (user && !user.verified) {
      router.push('/verificationFailed');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className='flex flex-1 flex-col justify-center align-middle min-h-screen'>
        <Spinner className='self-center' />
      </div>
    );
  }

  return (
    <>
      <Layout />
      <p>{user?.uid}</p>
    </>
  );
}
