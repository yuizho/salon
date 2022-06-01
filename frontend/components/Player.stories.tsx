import { Story, Meta } from '@storybook/react/types-6-0';
import Player from './Player';

export default {
  title: 'Player',
  component: Player,
} as Meta;

const Template: Story = ({ isShown, isMe }) => (
  <Player isShown={isShown} isMe={isMe} />
);

export const Default = Template.bind({});
Default.args = {
  isMe: true,
  isShown: false,
};
