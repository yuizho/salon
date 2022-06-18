import { Story, Meta } from '@storybook/react/types-6-0';
import { Component } from './ErrorAlert';
export default {
  title: 'Atoms/ErrorAlert',
  component: Component,
} as Meta;

const Template: Story = ({ message, onClose }) => {
  return <Component message={message} onClose={onClose} />;
};

export const Default = Template.bind({});
Default.args = {
  message:
    '通信エラーが発生しました。ネットワークの状態を確認し、解決しない場合は時間をおいてからやり直してください。',
  onClose: () => alert('close button is clicked!!!'),
};
