import type { AppProps } from 'next/app';
import { config, library } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import '@/styles/globals.css';
import { faS, fas } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { child, get, ref } from 'firebase/database';
import moment from 'moment';
import 'moment/locale/ko';
import { auth, database } from '@/api';
import { User, UserStore } from '@/stores';
import { flushSync } from 'react-dom';

library.add(fas, faS);
moment.locale('ko');

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        UserStore.setLoading(true);
        get(child(ref(database), `users/${user.uid}`)).then((snapshot) => {
          flushSync(() => {
            if (snapshot.exists()) {
              UserStore.updateUser(User.create(snapshot.val()));
            } else {
              UserStore.updateUser(null);
            }
          });
        });
        UserStore.setLoading(false);
      } else {
        UserStore.updateUser(null);
        UserStore.setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <Component {...pageProps} />;
}
export default observer(App);
