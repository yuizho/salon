import { Meta, StoryFn } from '@storybook/react';
import { Component } from './Button';
export default {
  title: 'Atoms/Button',
  component: Component,
} as Meta;

const Template: StoryFn = ({ text, glow, clickable, onClick }) => {
  return (
    <Component
      text={text}
      glow={glow}
      clickable={clickable}
      onClick={onClick}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  text: 'OK',
  glow: false,
  clickable: true,
  onClick: () => alert('clicked!!'),
};
