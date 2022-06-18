import Link from 'next/link';
import { FC } from 'react';

type Props = {
  children: React.ReactNode;
  href: string;
  className: string;
  newWindow?: boolean;
};

export const Component: FC<Props> = ({ children, href, className, newWindow = false }) => (
  <Link href={href}>
    {newWindow ? (
      <a target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    ) : (
      <a className={className}>{children}</a>
    )}
  </Link>
);

const Container: FC<Props> = ({ children, href, className, newWindow = false }) => (
  <Component href={href} className={className} newWindow={newWindow}>
    {children}
  </Component>
);

export default Container;
