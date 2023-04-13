import { Layout } from '@/components';
import { useAuth } from '@/hooks';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function VerificationFailed() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user && user.verified) {
      router.push('/');
    }
  }, [user, router, loading]);

  return (
    <>
      <Layout />
      <div className='flex flex-col justify-center'>
        <Image
          src='/2division.png'
          width={300}
          height={300}
          alt='division logo'
          className='self-center'
          priority
        />
        <h1
          className='my-5 self-center font-bold'
          style={{ fontSize: 25 }}
        >
          용사 확인중에 있습니다
        </h1>
        <p className='text-center'>운영자: 조재영</p>
      </div>
    </>
  );
}
