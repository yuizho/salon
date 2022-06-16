import Link from 'next/link';
import { FC } from 'react';

export const Component: FC = () => (
  <nav className="flex ustify-between flex-wrap py-4 px-6 border-b">
    <div className="flex items-center flex-shrink-0 text-slate-800">
      <Link href="/">
        <a className="font-bold text-2xl tracking-tight">Salon</a>
      </Link>
    </div>
  </nav>
);

const Container: FC = () => <Component />;

export default Container;
