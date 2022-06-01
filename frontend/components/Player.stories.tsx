import { Story, Meta } from '@storybook/react/types-6-0';
import Player from './Player';

export default {
  title: 'Player',
  component: Player,
} as Meta;

const Template: Story = ({ userId, value, isShown, isMe }) => (
  <Player userId={userId} value={value} isShown={isShown} isMe={isMe} />
);

export const Default = Template.bind({});
Default.args = {
  userId: 'xxx',
  value: 'XL',
  isMe: true,
  isShown: false,
};
