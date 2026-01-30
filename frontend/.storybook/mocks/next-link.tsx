import React, { forwardRef } from 'react';

const MockLink = forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ href, children, ...rest }, ref) => {
  return (
    <a href={href} ref={ref} {...rest}>
      {children}
    </a>
  );
});

MockLink.displayName = 'Link';

export default MockLink;
