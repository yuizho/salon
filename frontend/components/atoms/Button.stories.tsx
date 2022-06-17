import { Story, Meta } from '@storybook/react/types-6-0';
import { Component } from './Button';
export default {
  title: 'Atoms/Button',
  component: Component,
} as Meta;

const Template: Story = ({ text, onClick, glow }) => {
  return <Component text={text} onClick={onClick} glow={glow} />;
};

export const Default = Template.bind({});
Default.args = {
  text: 'OK',
  onClick: () => alert('clicked!!'),
  glow: false,
};
