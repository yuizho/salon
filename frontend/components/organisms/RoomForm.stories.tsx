import { Story, Meta } from '@storybook/react/types-6-0';
import { Component } from './RoomForm';

export default {
  title: 'Organisms/RoomForm',
  component: Component,
} as Meta;

const Template: Story = ({ onClick }) => <Component onClick={onClick} />;

export const Default = Template.bind({});
Default.args = {
  onClick: () => alert('click'),
};
