import { Story, Meta } from '@storybook/react/types-6-0';
import { Component } from './Header';
export default {
  title: 'Molecules/Header',
  component: Component,
} as Meta;

const Template: Story = ({ message, error, onClose }) => {
  return <Component message={message} error={error} onClose={() => onClose(false)} />;
};

export const Default = Template.bind({});
Default.args = {
  message: '',
  error: false,
  onClose: () => alert('clicked close button'),
};

export const Error = Template.bind({});
Error.args = {
  message: '何かしらのエラーが発生しました！',
  error: true,
  onClose: () => alert('clicked close button'),
};
