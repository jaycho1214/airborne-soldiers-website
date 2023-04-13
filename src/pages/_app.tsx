import type { AppProps } from 'next/app';
import { config, library } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
config.autoAddCss = false;
import { UserProvider } from '@/contexts';
import '@/styles/globals.css';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}
