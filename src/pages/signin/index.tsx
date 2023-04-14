import { signInWithEmailAndPassword } from 'firebase/auth';
import { observer } from 'mobx-react-lite';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import InputMask from 'react-input-mask';
import { auth } from '@/api';
import { FormSubmitButton, Layout, Spinner, TextInput } from '@/components';
import { UserStore } from '@/stores';

function SignIn() {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = UserStore;
  const onSubmit: SubmitHandler<FieldValues> = useCallback(async (data) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(
        auth,
        `${(data.serviceNumber as string).replaceAll('-', '')}@anon.com`,
        data.password,
      );
    } catch (e) {
      const error: any = e;
      if (error.code === 'auth/user-not-found') {
        setError('해당 용사를 찾을 수 없습니다');
      } else if (
        error.code === 'auth/invalid-password' ||
        error.code === 'auth/wrong-password'
      ) {
        setError('잘못된 비밀번호입니다');
      } else {
        setError('알 수 없는 오류가 발생했습니다');
      }
    } finally {
      setLoading(false);
    }
  }, []);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [router, user]);

  return (
    <>
      <Layout />
      <form
        action='#'
        method='POST'
        onSubmit={handleSubmit(onSubmit, () => console.log('CALLED'))}
      >
        <div className='flex flex-1 flex-col mx-8 align-middle min-h-screen'>
          <Image
            src='/2division.png'
            width={500}
            height={500}
            alt='division logo'
            className='self-center'
            priority
          />
          <h1
            className='my-5 self-center font-bold'
            style={{ fontSize: 25 }}
          >
            전투근무지원대대
          </h1>
          <Controller
            control={control}
            name='serviceNumber'
            rules={{
              maxLength: 11,
              required: true,
              minLength: 11,
              pattern: /^\d{2}-\d{8}$/,
            }}
            render={({ field: { onChange, onBlur, value, name } }) => (
              <div className='my-2 w-full'>
                <InputMask
                  mask='99-99999999'
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  name={name}
                  className='p-5 w-full'
                  style={{ backgroundColor: '#1C1C1C', borderRadius: 15 }}
                  placeholder='군 번'
                  inputMode='numeric'
                />
                {errors.serviceNumber?.type === 'pattern' && (
                  <p>잘못된 형식의 군번입니다</p>
                )}
                {errors.serviceNumber?.type === 'required' && (
                  <p className='text-red-500 mt-1'>군번을 입력해주세요</p>
                )}
              </div>
            )}
          />
          <div className='flex flex-col my-2'>
            <TextInput
              {...register('password', { required: true, minLength: 6 })}
              type='password'
              placeholder='비밀번호'
              className='w-full'
            />
            {errors.password?.type === 'minLength' && (
              <p>비밀번호는 최소 6자 이상입니다</p>
            )}
            {errors.password?.type === 'required' && (
              <p className='text-red-500 mt-1'>비밀번호를 입력해주세요</p>
            )}
          </div>
          {loading ? (
            <Spinner className='self-center my-3' />
          ) : (
            <FormSubmitButton
              value='로그인'
              className='my-3'
            />
          )}
          {error && <p className='text-red-500 my-1 self-center'>{error}</p>}
          <Link
            className='self-center mb-5'
            href='/signup'
          >
            회원가입
          </Link>
        </div>
      </form>
    </>
  );
}

export default observer(SignIn);
