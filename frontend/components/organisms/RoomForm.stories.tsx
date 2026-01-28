import { Meta, StoryFn } from '@storybook/react';
import { Component } from './RoomForm';

export default {
  title: 'Organisms/RoomForm',
  component: Component,
} as Meta;

const Template: StoryFn = ({ onClick }) => <Component onClick={onClick} />;

export const Default = Template.bind({});
Default.args = {
  onClick: () => alert('click'),
};
