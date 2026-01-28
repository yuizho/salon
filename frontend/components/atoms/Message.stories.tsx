import { Meta, StoryFn } from '@storybook/react';
import { Component } from './Message';
export default {
  title: 'Atoms/Message',
  component: Component,
} as Meta;

const Template: StoryFn = ({ message }) => {
  return <Component message={message} />;
};

export const Default = Template.bind({});
Default.args = {
  message: 'this is message!!',
};
