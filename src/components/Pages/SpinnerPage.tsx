import { Layout, Spinner } from '@/components';

export default function SpinnerPage() {
  return (
    <>
      <Layout />
      <div className='flex flex-1 flex-col justify-center align-middle min-h-screen'>
        <Spinner className='self-center' />
      </div>
    </>
  );
}
