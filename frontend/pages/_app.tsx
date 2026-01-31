import '../styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import { Amplify } from 'aws-amplify';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { RecoilRoot } from 'recoil';

Amplify.configure({
  API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_APPSYNC_URL ?? '',
      region: 'ap-northeast-1',
      defaultAuthMode: 'apiKey',
      apiKey: process.env.NEXT_PUBLIC_APPSYNC_API_KEY ?? '',
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Salon</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>

      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>

      <Analytics />
    </>
  );
}

export default MyApp;
