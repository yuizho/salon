import { FC } from 'react';

type Props = {
  message: string;
};

export const Component: FC<Props> = ({ message }) => (
  <div className="border-t border-b border-slate-400 text-slate-600 px-4 py-3" role="alert">
    <p className="text-sm">{message}</p>
  </div>
);

const Container: FC<Props> = ({ message }) => <Component message={message} />;

export default Container;
