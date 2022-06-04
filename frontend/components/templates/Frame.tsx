import { FC } from 'react';
import Header from '../molecules/Header';

type Props = {
  children: React.ReactNode;
};

export const Component: FC<Props> = ({ children }) => (
  <>
    <Header />
    <div className="container mx-auto p-5">{children}</div>
  </>
);

const Container: FC<Props> = ({ children }) => (
  <Component>{children}</Component>
);

export default Container;
