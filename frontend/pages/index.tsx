import Head from 'next/head';
import { FC } from 'react';
import Link from '../components/atoms/Link';
import RoomForm from '../components/organisms/RoomForm';
import Frame from '../components/templates/Frame';

const Home: FC = (): JSX.Element => (
  <>
    <Head>
      <title>Salon</title>
      <meta name="og:title" content="Salon" />
      <meta property="og:site_name" content="Salon" />
      <meta
        name="og:description"
        content="Salonはログイン不要の無料Webプランニングポーカーサービスです"
      />
    </Head>

    <Frame>
      <main className="flex flex-col space-y-6">
        <RoomForm />
        <div className="flex flex-col space-y-3">
          <h2 className="text-slate-700 font-semibold px-1">免責事項</h2>
          <div className="text-slate-600 text-sm px-6">
            <ul className="list-disc">
              <li>
                当サービスは{' '}
                <Link href="https://github.com/yuizho" newWindow className="underline">
                  yuizho
                </Link>{' '}
                が個人で運営するサービスです。サービスの維持が難しくなった場合には予告なくサービスを終了するかもしれません。
              </li>
              <li>
                できる範囲でサービスの維持に努めますが、当サービスで検出された不具合やそれが原因で発生した損害などについては一切責任を負いかねます。
              </li>
              <li>
                当サービスは、サービスの改善に役立てる目的で{' '}
                <Link href="https://sentry.io" newWindow className="underline">
                  Sentry
                </Link>{' '}
                を利用しています。
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          <h2 className="text-slate-700 font-semibold px-1">ライセンス</h2>
          <div className="text-slate-600 text-sm px-6">
            <ul className="list-disc">
              <li>
                当サービスは{' '}
                <Link href="https://heropatterns.com/" newWindow className="underline">
                  Hero Patterns
                </Link>{' '}
                で作成した画像を一部加工し、{' '}
                <Link
                  href="https://creativecommons.org/licenses/by/4.0/"
                  newWindow
                  className="underline"
                >
                  CC BY 4.0
                </Link>{' '}
                に基づいて利用しています
              </li>
            </ul>
          </div>
        </div>
      </main>
    </Frame>
  </>
);

export default Home;
