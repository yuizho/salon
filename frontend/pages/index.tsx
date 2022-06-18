import { FC } from 'react';
import Link from '../components/atoms/Link';
import RoomForm from '../components/organisms/RoomForm';
import Frame from '../components/templates/Frame';

const Home: FC = (): JSX.Element => (
  <Frame>
    <main className="flex flex-col gap-5">
      <RoomForm />

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
            当サービスは、サービスの改善に役立てる目的で Googleアナリティクスを利用しています。
          </li>
        </ul>
      </div>
    </main>
  </Frame>
);

export default Home;
