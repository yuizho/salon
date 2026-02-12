import '../styles/globals.css';
import '../i18n';
import { Analytics } from '@vercel/analytics/react';
import { Amplify } from 'aws-amplify';
import { useAtom } from 'jotai';
import i18n from 'i18next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import { appState } from '../states/app';

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
  const [app, setApp] = useAtom(appState);

  useEffect(() => {
    // Sync Jotai state to i18next
    i18n.changeLanguage(app.language);
  }, [app.language]);

  useEffect(() => {
    // Persistence: load from localStorage on mount
    const savedLang = localStorage.getItem('salon_lang');
    if (savedLang === 'en' || savedLang === 'ja') {
      setApp((prev) => ({ ...prev, language: savedLang }));
    }
  }, [setApp]);

  useEffect(() => {
    // Persistence: save to localStorage on change
    localStorage.setItem('salon_lang', app.language);
  }, [app.language]);

  return (
    <>
      <Head>
        <title>Salon</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>

      <Component {...pageProps} />

      <Analytics />
    </>
  );
}

export default MyApp;

export default MyApp;
