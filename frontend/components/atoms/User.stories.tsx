import { Meta, StoryFn } from '@storybook/react';
import Component from './User';

export default {
  title: 'Atoms/User',
  component: Component,
} as Meta;

const Template: StoryFn = ({ me, clickable, onClick }) => (
  <Component me={me} clickable={clickable} onClick={onClick} />
);

export const Default = Template.bind({});
Default.args = {
  me: true,
  clickable: true,
  onClick: () => alert('clicked!!!'),
};
