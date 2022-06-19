import { Story, Meta } from '@storybook/react/types-6-0';
import Component from './User';

export default {
  title: 'Atoms/User',
  component: Component,
} as Meta;

const Template: Story = ({ me, clickable, onClick }) => (
  <Component me={me} clickable={clickable} onClick={onClick} />
);

export const Default = Template.bind({});
Default.args = {
  me: true,
  clickable: true,
  onClick: () => alert('clicked!!!'),
};
