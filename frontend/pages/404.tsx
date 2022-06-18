import { FC } from 'react';
import Link from '../components/atoms/Link';
import Frame from '../components/templates/Frame';

const NotFound: FC = (): JSX.Element => (
  <Frame>
    <div className="space-y-6 border rounded p-8 text-slate-600">
      この部屋は有効期限を過ぎたのでクローズされました。新たにプランニングポーカーを始めるには{' '}
      <Link href="/" className="underline">
        トップページ
      </Link>{' '}
      から新しい部屋を作成してください。
    </div>
  </Frame>
);

export default NotFound;
