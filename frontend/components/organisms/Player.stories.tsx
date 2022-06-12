import { Story, Meta } from '@storybook/react/types-6-0';
import { useState } from 'react';
import { Status } from '../../graphql/schema';
import { Component } from './Player';

export default {
  title: 'Organisms/Player',
  component: Component,
} as Meta;

const Template: Story = ({ userId, status, value, shown, me, onKick }) => {
  const [openKickDialog, setOpenKickDialog] = useState(false);

  return (
    <Component
      userId={userId}
      status={status}
      value={value}
      shown={shown}
      me={me}
      onKick={onKick}
      openKickDialog={openKickDialog}
      setOpenKickDialog={setOpenKickDialog}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  userId: 'xxx',
  status: Status.CHOOSING,
  value: 'XL',
  me: true,
  shown: false,
  onKick: () => alert('kicked!!!!'),
};
