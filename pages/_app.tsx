import Layout from 'components/layout'
import type { AppProps } from 'next/app'
import '../styles/globals.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return <div className="app">

    <Layout>
      <Component {...pageProps} />
    </Layout>

  </div>

}

export default MyApp
