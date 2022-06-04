import { FC } from 'react';

export const Component: FC = () => (
  <nav className="flex items-center justify-between flex-wrap p-4 border-b ">
    <div className="flex items-center flex-shrink-0 text-slate-600 mr-6">
      <span className="font-semibold text-2xl tracking-tight">Salon</span>
    </div>
  </nav>
);

const Container: FC = () => <Component />;

export default Container;
