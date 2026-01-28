import { Meta, StoryFn } from '@storybook/react';
import { Component } from './NavBar';
export default {
  title: 'Atoms/NavBar',
  component: Component,
} as Meta;

const Template: StoryFn = () => {
  return <Component />;
};

export const Default = Template.bind({});
Default.args = {};
