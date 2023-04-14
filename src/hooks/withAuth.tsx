import { UserStore } from '@/stores';
import { Observer, observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export default function withAuth(Component: () => JSX.Element) {
  return observer((props) => {
    const router = useRouter();
    const { loading, user } = UserStore;
    useEffect(() => {
      if (loading) return;
      if (!user) {
        router.push('/signin');
      } else if (user && !user.verified) {
        router.push('/verificationFailed');
      }
    }, [loading, user, router]);
    return <Observer>{() => <Component {...props} />}</Observer>;
  });
}
