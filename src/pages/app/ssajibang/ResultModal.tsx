import { Spinner } from '@/components';
import { IUser, UserStore } from '@/stores';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import Modal, { Props } from 'react-modal';

export interface ResultModalProps extends Props {
  onPressClosed?: () => void;
  uid: string[];
}

export default function ResultModal({
  style,
  onPressClosed,
  uid,
  ...rest
}: ResultModalProps) {
  const [users, setUsers] = useState([] as IUser[]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all(uid.map((u) => UserStore.fetchUser(u))).then((newUsers) => {
      setUsers(newUsers as IUser[]);
      setLoading(false);
    });
  }, [uid]);

  return (
    <Modal
      {...rest}
      style={{
        overlay: {
          backgroundColor: 'rgba(0,0,0,0.7)',
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
        },
        ...style,
      }}
    >
      {loading ? (
        <Spinner />
      ) : (
        <div className='bg-white flex flex-1 flex-col w-100'>
          <FontAwesomeIcon
            icon={['fas', 'xmark']}
            className='self-start'
            color='#000000'
            size='xl'
            onClick={(event) => {
              event.preventDefault();
              onPressClosed?.();
            }}
          />
          <h1
            className='text-black self-center font-bold'
            style={{ fontSize: 20 }}
          >
            결과
          </h1>
          {users.map((user) => (
            <p
              key={user.uid}
              className='text-black my-3'
            >
              {`${user!.rank} ${user!.name}`}
            </p>
          ))}
        </div>
      )}
    </Modal>
  );
}
