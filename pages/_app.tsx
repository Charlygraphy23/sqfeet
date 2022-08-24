import Layout from 'components/layout';
import type { AppProps } from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import '../styles/globals.scss';

NProgress.configure({ showSpinner: false });

// Binding events.
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const MyApp = ({ Component, pageProps }: AppProps) => (
  <div className='app'>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </div>
);

export default MyApp;
