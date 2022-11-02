/* eslint-disable prettier/prettier */
import {
  Hydrate,
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Layout from 'components/layout';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import NProgress from 'nprogress';
import { useState } from 'react';
import '../styles/globals.scss';

NProgress.configure({ showSpinner: false });

// Binding events.
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  const [queryClient] = useState(() => new QueryClient());

  if (queryClient.isFetching()) {
    console.warn('At least one query is fetching!');
  }

  if (queryClient.isMutating()) {
    console.warn('At least one mutation is fetching!');
  }

  return (

    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Head>
          <meta charSet='utf-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
        </Head>
        <SessionProvider session={session}>
          <div className='app'>
            <Layout>
              <Component {...pageProps} />
            </Layout>
            <div className='app_toast' />
          </div>
        </SessionProvider>
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>

  );
};

export default MyApp;
