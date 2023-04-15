import { createUserWithEmailAndPassword } from 'firebase/auth';
import { child, ref, set } from 'firebase/database';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import InputMask from 'react-input-mask';
import Link from 'next/link';
import { auth, database } from '@/api';
import {
  FormSubmitButton,
  Layout,
  Spinner,
  StyledSelect,
  TextInput,
} from '@/components';
import { Rank } from '@/stores';

export default function SignUp() {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    setError,
  } = useForm();
  const [customError, setCustomError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async (data) => {
      try {
        setLoading(true);
        if (data.password !== data.passwordConfirm) {
          setError('passwordConfirm', {
            type: 'custom',
            message: '비밀번호를 확인해주세요',
          });
          return;
        }
        const {
          user: { uid },
        } = await createUserWithEmailAndPassword(
          auth,
          `${(data.serviceNumber as string).replaceAll('-', '')}@anon.com`,
          data.password,
        );
        await set(child(ref(database), `users/${uid}`), {
          uid,
          name: data.name,
          rank: data.rank.value,
          serviceNumber: data.serviceNumber,
          unit: data.unit,
          verified: false,
        });
        router.push('/verificationFailed');
      } catch (e) {
        const error: any = e;
        if (
          error.code === 'auth/email-already-exists' ||
          error.code === 'auth/email-already-in-use'
        ) {
          setCustomError('이미 존재하는 군번입니다');
        } else if (error.code === 'auth/invalid-password') {
          setCustomError('잘못된 비밀번호입니다');
        } else {
          setCustomError('알 수 없는 오류가 발생했습니다');
        }
      } finally {
        setLoading(false);
      }
    },
    [setError, router],
  );

  return (
    <>
      <Layout />
      <form
        action='#'
        method='POST'
        onSubmit={handleSubmit(onSubmit, () => console.log('CALLED'))}
        className='bg-black'
      >
        <div className='flex flex-1 flex-col mx-8 align-middle min-h-screen'>
          <Image
            src='/2division.png'
            width={100}
            height={100}
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
                  className='p-5 w-full text-white'
                  style={{ backgroundColor: '#1C1C1C', borderRadius: 15 }}
                  placeholder='군 번'
                  inputMode='numeric'
                />
                {errors.serviceNumber?.type === 'pattern' && (
                  <p className='text-red-500 mt-1'>잘못된 형식의 군번입니다</p>
                )}
                {errors.serviceNumber?.type === 'required' && (
                  <p className='text-red-500 mt-1'>군번을 입력해주세요</p>
                )}
              </div>
            )}
          />
          <div className='flex flex-col my-2 text-white'>
            <TextInput
              type='name'
              placeholder='이름'
              className='w-full text-white'
              {...register('name', { required: true })}
            />
            {errors.name?.type === 'required' && (
              <p className='text-red-500 mt-1'>이름을 입력해주세요</p>
            )}
          </div>
          <div className='flex my-2 justify-evenly'>
            <Controller
              control={control}
              name='rank'
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value, name } }) => (
                <div>
                  <label>계급</label>
                  <StyledSelect
                    name={name}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    options={Rank.map((rank) => ({ value: rank, label: rank }))}
                  />
                </div>
              )}
            />
            <Controller
              control={control}
              name='unit'
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value, name } }) => (
                <div>
                  <label>중대</label>
                  <StyledSelect
                    name={name}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    options={['보급', '수송', '의무'].map((rank) => ({
                      value: rank,
                      label: rank,
                    }))}
                  />
                </div>
              )}
            />
          </div>
          <div className='flex flex-col my-2 text-white'>
            <TextInput
              {...register('password', { required: true, minLength: 6 })}
              type='password'
              placeholder='비밀번호'
              className='w-full text-white'
            />
            {errors.password?.type === 'minLength' && (
              <p className='text-red-500 mt-1'>
                비밀번호는 최소 6자 이상입니다
              </p>
            )}
            {errors.password?.type === 'required' && (
              <p className='text-red-500 mt-1'>비밀번호를 입력해주세요</p>
            )}
          </div>
          <div className='flex flex-col my-2 text-white'>
            <TextInput
              {...register('passwordConfirm', { required: true })}
              type='password'
              placeholder='비밀번호 확인'
              className='w-full text-white'
            />
            {errors.passwordConfirm && (
              <p className='text-red-500 mt-1'>비밀번호를 확인해주세요</p>
            )}
          </div>
          {loading ? (
            <Spinner className='self-center my-3' />
          ) : (
            <FormSubmitButton
              value='회원가입'
              className='my-3'
            />
          )}
          {customError && (
            <p className='text-red-500 my-1 self-center'>{customError}</p>
          )}
          <Link
            className='self-center text-white'
            href='/signin'
          >
            로그인
          </Link>
        </div>
      </form>
    </>
  );
}
