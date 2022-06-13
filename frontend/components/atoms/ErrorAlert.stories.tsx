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
  message: 'errorです！！！',
  onClose: () => alert('close button is clicked!!!'),
};
