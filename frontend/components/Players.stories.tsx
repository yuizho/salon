import { Story, Meta } from '@storybook/react/types-6-0';
import Players from './Players';

export default {
  title: 'Players',
  component: Players,
} as Meta;

const Template: Story = ({ myUserId, players, shouldOpenCards }) => (
  <Players
    myUserId={myUserId}
    players={players}
    shouldOpenCards={shouldOpenCards}
  />
);

export const Hidden = Template.bind({});
Hidden.args = {
  myUserId: 'xxx',
  players: [
    { userId: 'xxx', pickedCard: 'XL' },
    { userId: 'yyy', pickedCard: 'S' },
    { userId: 'zzz', pickedCard: 'M' },
  ],
  shouldOpenCards: false,
};

export const Shown = Template.bind({});
Shown.args = {
  myUserId: 'xxx',
  players: [
    { userId: 'xxx', pickedCard: 'XL' },
    { userId: 'yyy', pickedCard: 'S' },
    { userId: 'zzz', pickedCard: 'M' },
  ],
  shouldOpenCards: true,
};
