import { Story, Meta } from '@storybook/react/types-6-0';
import Players from './Players';

export default {
  title: 'Players',
  component: Players,
} as Meta;

const Template: Story = ({ myUserId, players, shown }) => (
  <Players myUserId={myUserId} players={players} shown={shown} />
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
