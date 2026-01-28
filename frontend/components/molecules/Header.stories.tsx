import { Meta, StoryFn } from '@storybook/react';
import { Component } from './Header';
export default {
  title: 'Molecules/Header',
  component: Component,
} as Meta;

const Template: StoryFn = ({ message, onClose }) => {
  return <Component message={message} onClose={() => onClose(false)} />;
};

export const Default = Template.bind({});
Default.args = {
  message: '',
  onClose: () => alert('clicked close button'),
};

export const ErrorMessage = Template.bind({});
ErrorMessage.args = {
  message: '何かしらのエラーが発生しました！',
  onClose: () => alert('clicked close button'),
};
