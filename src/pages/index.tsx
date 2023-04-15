import { MouseEventHandler, useCallback } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/api';
import { UserStore } from '@/stores';
import { Layout, Menu, SpinnerPage } from '@/components';
import { withAuth } from '@/hooks';

function Home() {
  const { user, loading } = UserStore;

  const handleSignOut = useCallback(() => {
    signOut(auth);
  }, []);

  const preparing: MouseEventHandler<HTMLAnchorElement> = useCallback(
    (event) => {
      event.preventDefault();
      alert('서비스 준비 중 입니다.');
    },
    [],
  );

  if (loading || !user) {
    return <SpinnerPage />;
  }

  return (
    <>
      <Layout />
      <div className='px-5 bg-black min-h-screen'>
        <h2
          className='font-bold mb-2 text-white'
          style={{ fontSize: 30 }}
        >{`${user.rank} ${user.name}`}</h2>
        <Menu
          icon={['fas', 'bullhorn']}
          text='공지사항'
          className='mb-4'
          onClick={preparing}
        />
        <Menu
          icon={['fas', 'computer']}
          text='연등 사지방 신청'
          className='mb-4'
          href='/app/ssajibang'
        />
        <Menu
          icon={['fas', 'comments']}
          text='커뮤니티'
          className='mb-4'
          onClick={preparing}
        />
        <Menu
          icon={['fas', 'heart']}
          text='상담 신청'
          className='mb-4'
          onClick={preparing}
        />
        <Menu
          icon={['fas', 'user-group']}
          text='동아리 신청'
          className='mb-4'
          onClick={preparing}
        />
        <div className='flex justify-center align-middle self-center my-5'>
          <button
            className='text-red-500'
            onClick={handleSignOut}
          >
            로그아웃
          </button>
        </div>
        <p className='text-center text-white'>운영자: 조재영</p>
      </div>
    </>
  );
}

export default withAuth(Home);
