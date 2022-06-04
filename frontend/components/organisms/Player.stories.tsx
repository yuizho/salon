import { Story, Meta } from '@storybook/react/types-6-0';
import Player from './Player';

export default {
  title: 'Organisms/Player',
  component: Player,
} as Meta;

const Template: Story = ({ userId, value, shown, me }) => (
  <Player userId={userId} value={value} shown={shown} me={me} />
);

export const Default = Template.bind({});
Default.args = {
  userId: 'xxx',
  value: 'XL',
  me: true,
  shown: false,
};
