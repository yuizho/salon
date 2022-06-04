import { Story, Meta } from '@storybook/react/types-6-0';
import { Component } from './NavBar';
export default {
  title: 'NavBar',
  component: Component,
} as Meta;

const Template: Story = () => {
  return <Component />;
};

export const Default = Template.bind({});
Default.args = {};
