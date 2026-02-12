import Head from 'next/head';
import { FC } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import Link from '../components/atoms/Link';
import RoomForm from '../components/organisms/RoomForm';
import Frame from '../components/templates/Frame';

const Home: FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t('home.title')}</title>
        <meta name='description' content={t('home.description')} />
        <link rel='canonical' href='https://salon-ppoker.com/' />

        <meta property='og:title' content={t('home.title')} />
        <meta property='og:site_name' content={t('home.title')} />
        <meta property='og:description' content={t('home.description')} />
        <meta
          property='og:image'
          content='https://salon-ppoker.com/og-image.png'
        />
        <meta property='og:url' content='https://salon-ppoker.com/' />
        <meta property='og:type' content='website' />

        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={t('home.title')} />
        <meta name='twitter:description' content={t('home.description')} />
        <meta
          name='twitter:image'
          content='https://salon-ppoker.com/og-image.png'
        />
      </Head>

      <Frame>
        <main className='flex flex-col space-y-6'>
          <RoomForm />
          <div className='flex flex-col space-y-3'>
            <h2 className='text-slate-700 font-semibold px-1'>
              {t('home.disclaimer')}
            </h2>
            <div className='text-slate-600 text-sm px-6'>
              <ul className='list-disc'>
                <li>
                  <Trans
                    i18nKey='home.disclaimer_item1'
                    components={[
                      <Link
                        key='yuizho'
                        href='https://github.com/yuizho'
                        newWindow
                        className='underline'
                      >
                        yuizho
                      </Link>,
                    ]}
                  />
                </li>
                <li>{t('home.disclaimer_item2')}</li>
                <li>
                  <Trans
                    i18nKey='home.disclaimer_item3'
                    components={[
                      <Link
                        key='sentry'
                        href='https://sentry.io'
                        newWindow
                        className='underline'
                      >
                        Sentry
                      </Link>,
                      <Link
                        key='vercel-analytics'
                        href='https://vercel.com/analytics'
                        newWindow
                        className='underline'
                      >
                        Vercel Analytics
                      </Link>,
                    ]}
                  />
                </li>
              </ul>
            </div>
          </div>
          <div className='flex flex-col space-y-3'>
            <h2 className='text-slate-700 font-semibold px-1'>
              {t('home.license')}
            </h2>
            <div className='text-slate-600 text-sm px-6'>
              <ul className='list-disc'>
                <li>
                  <Trans
                    i18nKey='home.license_item1'
                    components={[
                      <Link
                        key='heropatterns'
                        href='https://heropatterns.com/'
                        newWindow
                        className='underline'
                      >
                        Hero Patterns
                      </Link>,
                      <Link
                        key='ccby4'
                        href='https://creativecommons.org/licenses/by/4.0/'
                        newWindow
                        className='underline'
                      >
                        CC BY 4.0
                      </Link>,
                    ]}
                  />
                </li>
              </ul>
            </div>
          </div>
        </main>
      </Frame>
    </>
  );
};

export default Home;
