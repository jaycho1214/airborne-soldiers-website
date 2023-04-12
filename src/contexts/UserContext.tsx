import { auth, database } from '@/api';
import { IUser, User } from '@/stores';
import { child, get, ref, set } from 'firebase/database';
import { ReactNode, createContext, useEffect, useState } from 'react';

export interface UserContextType {
  user?: IUser | null;
  loading: boolean;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
});

export function UserProvider({ children }: { children?: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoading(true);
        get(child(ref(database), `users/${user.uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
            setUser(User.create(snapshot.val()));
          } else {
            setUser(null);
          }
          setLoading(false);
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
}
