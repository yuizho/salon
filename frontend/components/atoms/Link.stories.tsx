import { Meta, StoryFn } from '@storybook/react';
import { Component } from './Link';
export default {
  title: 'Atoms/Link',
  component: Component,
} as Meta;

const Template: StoryFn = ({ href, className, newWindow, children }) => {
  return (
    <Component href={href} className={className} newWindow={newWindow}>
      {children}
    </Component>
  );
};

export const Default = Template.bind({});
Default.args = {
  href: 'https://github.com/yuizho/salon',
  className: 'underline',
  newWindow: true,
  children: 'リンクです',
};
