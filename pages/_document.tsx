/* eslint-disable prettier/prettier */
import { Head, Html, Main, NextScript } from 'next/document';

const MyDocument = () => (
    <Html lang='en'>
        <Head>

            <link
                href='https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css'
                rel='stylesheet'
                integrity='sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx'
                crossOrigin='anonymous'

            />

            <link rel='preconnect' href='https://fonts.googleapis.com' />
            <link
                rel='preconnect'
                href='https://fonts.gstatic.com'
                crossOrigin='anonymous'
            />
            <link
                href='https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap'
                rel='stylesheet'
            />
        </Head>

        <body>
            <Main />

            <NextScript />
        </body>
    </Html>
);

export default MyDocument;
