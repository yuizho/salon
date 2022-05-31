import { Story, Meta } from '@storybook/react/types-6-0';
import User from './User';

export default {
  title: 'User',
  component: User,
} as Meta;

const Template: Story = ({ isMe }) => <User isMe={isMe} />;

export const Default = Template.bind({});
Default.args = {
  isMe: true,
};
