import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Amplify } from 'aws-amplify';
import { Analytics } from '@vercel/analytics/react';
import { RecoilRoot } from 'recoil';
import Head from 'next/head';

Amplify.configure({
  API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_APPSYNC_URL!,
      region: 'ap-northeast-1',
      defaultAuthMode: 'apiKey',
      apiKey: process.env.NEXT_PUBLIC_APPSYNC_API_KEY!,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Salon</title>
      </Head>

      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>

      <Analytics />
    </>
  );
}

export default MyApp;
