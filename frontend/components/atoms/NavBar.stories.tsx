import { Story, Meta } from '@storybook/react/types-6-0';
import { Component } from './NavBar';
export default {
  title: 'Atoms/NavBar',
  component: Component,
} as Meta;

const Template: Story = () => {
  return <Component />;
};

export const Default = Template.bind({});
Default.args = {};
