import { Story, Meta } from '@storybook/react/types-6-0';
import { Component } from './Message';
export default {
  title: 'Atoms/Message',
  component: Component,
} as Meta;

const Template: Story = ({ message }) => {
  return <Component message={message} />;
};

export const Default = Template.bind({});
Default.args = {
  message: 'this is message!!',
};
