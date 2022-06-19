import { Story, Meta } from '@storybook/react/types-6-0';
import { Component } from './Hands';

export default {
  title: 'Organisms/Hands',
  component: Component,
} as Meta;

const Template: Story = ({ values, glow, choosable, onClick }) => (
  <Component values={values} glow={glow} choosable={choosable} onClick={onClick} />
);

export const Default = Template.bind({});
Default.args = {
  values: ['0', '1', '2', '3', '5', '8', '13', '21', '34', '55'],
  glow: false,
  choosable: true,
  onClick: (a: string) => alert(`${a} is clicked`),
};
