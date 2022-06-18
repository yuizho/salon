import { FC } from 'react';
import Frame from '../components/templates/Frame';

const NotFound: FC = (): JSX.Element => (
  <Frame>
    <div className="space-y-6 border rounded p-8 text-slate-600">
      この部屋は有効期限を過ぎたのでクローズされました。新たにプランニングポーカーを始めるには{' '}
      {/* use a tag intentionally here to run leave process by leave hooks */}
      {/* eslint-disable @next/next/no-html-link-for-pages */}
      <a href="/" className="underline">
        トップページ
      </a>{' '}
      から新しい部屋を作成してください。
    </div>
  </Frame>
);

export default NotFound;
