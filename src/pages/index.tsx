import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { UserProvider } from '@/contexts';
import { useAuth } from '@/hooks';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Layout } from '@/components';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [loading, user, router]);

  if (loading) {
  }

  return (
    <>
      <Layout />
    </>
  );
}
