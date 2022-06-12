import { Story, Meta } from '@storybook/react/types-6-0';
import { Status } from '../../graphql/schema';
import { Component } from './Player';

export default {
  title: 'Organisms/Player',
  component: Component,
} as Meta;

const Template: Story = ({ userId, status, value, shown, me }) => (
  <Component
    userId={userId}
    status={status}
    value={value}
    shown={shown}
    me={me}
  />
);

export const Default = Template.bind({});
Default.args = {
  userId: 'xxx',
  status: Status.CHOOSING,
  value: 'XL',
  me: true,
  shown: false,
};
