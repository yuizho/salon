import { Story, Meta } from '@storybook/react/types-6-0';
import Component from './User';

export default {
  title: 'Atoms/User',
  component: Component,
} as Meta;

const Template: Story = ({ me, onClick }) => (
  <Component me={me} onClick={onClick} />
);

export const Default = Template.bind({});
Default.args = {
  me: true,
  onClick: () => alert('clicked!!!'),
};
