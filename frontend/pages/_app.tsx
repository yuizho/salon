import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Amplify } from 'aws-amplify';
import { Analytics } from '@vercel/analytics/react';
import { RecoilRoot } from 'recoil';
import Head from 'next/head';

Amplify.configure({
  aws_appsync_region: 'ap-northeast-1',
  aws_appsync_graphqlEndpoint: process.env.NEXT_PUBLIC_APPSYNC_URL,
  aws_appsync_authenticationType: 'API_KEY',
  aws_appsync_apiKey: process.env.NEXT_PUBLIC_APPSYNC_API_KEY,
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
