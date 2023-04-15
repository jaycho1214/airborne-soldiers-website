import { get, onValue, ref, runTransaction } from 'firebase/database';
import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import moment from 'moment';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IUser, UserStore } from '@/stores';
import { database } from '@/api';
import { Box, FormSubmitButton, Layout } from '@/components';
import { SpinnerPage } from '@/components';
import { ResultModal } from './components';

function SsajibangPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    applicants: [] as IUser[],
    results: [],
  });
  const [modalOpened, setModalOpened] = useState(false);
  const timeAnimationRef = useRef<number | null>(null);
  const [time, setTime] = useState('');

  const runAnimationFrame = useCallback(() => {
    setTime(moment().format('ll HH:mm:ss:SSS'));
    timeAnimationRef.current = requestAnimationFrame(runAnimationFrame);
  }, []);

  useEffect(() => {
    const init = async () => {
      const now = moment().utcOffset('+09:00');
      const applicantsRef = ref(
        database,
        `ssajibang/records/${now.year()}-${now.month()}/${now.date()}/results`,
      );
      const snapshot = await get(applicantsRef);
      if (snapshot.exists()) {
        setData((state) => ({ ...state, results: snapshot.val() }));
      }
    };
    init();
  }, []);

  useEffect(() => {
    timeAnimationRef.current = requestAnimationFrame(runAnimationFrame);
    const now = moment().utcOffset('+09:00');
    const applicantsRef = ref(
      database,
      `ssajibang/records/${now.year()}-${now.month()}/${now.date()}/applicants`,
    );
    const unsubscribe = onValue(applicantsRef, async (data) => {
      setLoading(true);
      if (!data.exists()) {
        setData((state) => ({
          ...state,
          applicants: [],
        }));
        setLoading(false);
        return;
      }
      const newData = data.val() ?? ([] as string[]);
      const users = await Promise.all(
        newData.map((uid: string) => UserStore.fetchUser(uid)),
      );
      setData((state) => ({
        ...state,
        applicants: users,
      }));
      setLoading(false);
    });
    return () => {
      unsubscribe();
      if (timeAnimationRef.current) {
        cancelAnimationFrame(timeAnimationRef.current);
      }
    };
  }, [runAnimationFrame]);

  const handleOnRegister: MouseEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      e.preventDefault();
      if (
        !moment()
          .utcOffset('+09:00')
          .isBefore(
            moment()
              .utcOffset('+09:00')
              .hour(20)
              .minute(55)
              .second(0)
              .millisecond(0),
          )
      ) {
        alert('신청 시간이 지났습니다');
        return;
      }
      const now = moment().utcOffset('+09:00');
      const applicantsRef = ref(
        database,
        `ssajibang/records/${now.year()}-${now.month()}/${now.date()}/applicants`,
      );
      runTransaction(applicantsRef, (data: string[]) => {
        if (data) {
          if (data.includes(UserStore.user!.uid)) {
            data = data.filter(
              (applicant: string) => applicant !== UserStore.user!.uid,
            );
            return data;
          }
          data = [...data, UserStore.user!.uid];
          return data;
        }
        return [UserStore.user!.uid];
      });
    },
    [],
  );

  if (loading) {
    return <SpinnerPage />;
  }

  return (
    <>
      <Layout />
      <div className='flex flex-col justify-center min-h-screen bg-black'>
        <Box className='mb-5'>
          <FontAwesomeIcon
            icon={['fas', 'computer']}
            size='5x'
            className='mt-5'
            color='#fff'
          />
          <h1
            className='font-bold my-5 text-center text-white'
            style={{ fontSize: 25 }}
          >
            연등 사지방 신청
          </h1>
        </Box>
        <Box className='mb-5 py-5'>
          <p
            className='text-center mb-5 text-white font-bold'
            style={{ fontSize: 20 }}
          >
            {time}
          </p>
          <p className='text-center text-red-600 mb-3'>
            신청은 당일 20시 55분 00초 까지
          </p>
        </Box>
        <Box className='mb-5 pb-5'>
          <p
            className='text-center mt-3 text-white font-bold '
            style={{ fontSize: 25 }}
          >
            신청 명단 {data.applicants.length}명
          </p>
          <div className='flex flex-col my-3 justify-center'></div>
          {data.applicants.map((applicant) => (
            <p
              key={applicant.uid}
              className='text-white self-center my-1'
            >
              {`${applicant.rank} ${applicant.name}`}
            </p>
          ))}
        </Box>
        {data.results.length > 0 && (
          <FormSubmitButton
            className='my-5'
            value='결과'
            onClick={(event) => {
              event.preventDefault();
              setModalOpened(true);
            }}
          />
        )}
        {moment()
          .utcOffset('+09:00')
          .isBefore(
            moment()
              .utcOffset('+09:00')
              .hour(20)
              .minute(55)
              .second(0)
              .millisecond(0),
          ) && (
          <FormSubmitButton
            value={
              data.applicants.findIndex(
                (applicant) => applicant.uid === UserStore.user?.uid,
              ) === -1
                ? '신청하기'
                : '신청 취소하기'
            }
            onClick={handleOnRegister}
          />
        )}
      </div>
      <ResultModal
        isOpen={modalOpened}
        onPressClosed={() => setModalOpened(false)}
        uid={data.results}
      />
    </>
  );
}

export default observer(SsajibangPage);
