import { Story, Meta } from '@storybook/react/types-6-0';
import { useState } from 'react';
import { Status } from '../../graphql/schema';
import { Component } from './Player';

export default {
  title: 'Organisms/Player',
  component: Component,
} as Meta;

const Template: Story = ({ userId, status, value, shown, kickable, me, onKick }) => {
  const [openKickDialog, setOpenKickDialog] = useState(false);

  return (
    <Component
      userId={userId}
      status={status}
      value={value}
      shown={shown}
      me={me}
      kickable={kickable}
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
  kickable: true,
  onKick: () => alert('kicked!!!!'),
};
