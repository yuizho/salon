import { Story, Meta } from '@storybook/react/types-6-0';
import { Component } from './Header';
export default {
  title: 'Molecules/Header',
  component: Component,
} as Meta;

const Template: Story = ({ message, onClose }) => {
  return <Component message={message} onClose={() => onClose(false)} />;
};

export const Default = Template.bind({});
Default.args = {
  message: '',
  onClose: () => alert('clicked close button'),
};

export const Error = Template.bind({});
Error.args = {
  message: '何かしらのエラーが発生しました！',
  onClose: () => alert('clicked close button'),
};
