import { Story, Meta } from '@storybook/react/types-6-0';
import { Component } from './Players';

export default {
  title: 'Organisms/Players',
  component: Component,
} as Meta;

const Template: Story = ({ myUserId, players, shown }) => (
  <Component myUserId={myUserId} players={players} shown={shown} />
);

export const Hidden = Template.bind({});
Hidden.args = {
  myUserId: 'xxx',
  players: [
    { userId: 'xxx', pickedCard: 'XL' },
    { userId: 'yyy', pickedCard: 'S' },
    { userId: 'zzz', pickedCard: 'M' },
  ],
  shown: false,
};

export const Shown = Template.bind({});
Shown.args = {
  myUserId: 'xxx',
  players: [
    { userId: 'xxx', pickedCard: 'XL' },
    { userId: 'yyy', pickedCard: 'S' },
    { userId: 'zzz', pickedCard: 'M' },
  ],
  shown: true,
};
