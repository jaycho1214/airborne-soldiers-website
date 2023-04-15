import { Layout } from '@/components';
import { UserStore } from '@/stores';
import { observer } from 'mobx-react-lite';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function VerificationFailed() {
  const { user, loading } = UserStore;
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
      <div className='flex flex-1 min-h-screen flex-col justify-center bg-black'>
        <Link
          href='/'
          className='self-center'
        >
          <Image
            src='/2division.png'
            width={300}
            height={300}
            alt='division logo'
            className='self-center'
            priority
          />
        </Link>
        <h1
          className='my-5 self-center font-bold text-white'
          style={{ fontSize: 25 }}
        >
          용사 확인중에 있습니다
        </h1>
        <p className='text-center text-white'>운영자: 조재영</p>
      </div>
    </>
  );
}

export default observer(VerificationFailed);
