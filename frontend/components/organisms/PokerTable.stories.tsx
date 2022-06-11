import { Story, Meta } from '@storybook/react/types-6-0';
import { useState } from 'react';
import { Component } from './PokerTable';

export default {
  title: 'Organisms/PokerTable',
  component: Component,
} as Meta;

const Template: Story = ({ me, users, poker, onReset }) => {
  const [openResetDialog, setOpenResetDialog] = useState(false);

  return (
    <Component
      me={me}
      users={users}
      poker={poker}
      onReset={onReset}
      openResetDialog={openResetDialog}
      setOpenResetDialog={setOpenResetDialog}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  me: { roomId: 'xxxxx', userId: 'xxx' },
  users: [
    { userId: 'xxx', pickedCard: 'XL' },
    { userId: 'yyy', pickedCard: 'S' },
    { userId: 'zzz', pickedCard: 'M' },
    { userId: 'zzz', pickedCard: 'M' },
    { userId: 'zzz', pickedCard: 'M' },
    { userId: 'zzz', pickedCard: 'M' },
    { userId: 'zzz', pickedCard: 'M' },
    { userId: 'zzz', pickedCard: 'M' },
  ],
  poker: { shown: false },
  onReset: () => alert('reset button is clicked!!'),
};
