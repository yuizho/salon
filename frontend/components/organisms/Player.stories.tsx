import { Story, Meta } from '@storybook/react/types-6-0';
import { Status } from '../../graphql/schema';
import Player from './Player';

export default {
  title: 'Organisms/Player',
  component: Player,
} as Meta;

const Template: Story = ({ userId, status, value, shown, me }) => (
  <Player userId={userId} status={status} value={value} shown={shown} me={me} />
);

export const Default = Template.bind({});
Default.args = {
  userId: 'xxx',
  status: Status.CHOOSING,
  value: 'XL',
  me: true,
  shown: false,
};
