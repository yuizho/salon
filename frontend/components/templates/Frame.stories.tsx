import { Meta, StoryFn } from '@storybook/react';
import { Component } from './Frame';
export default {
  title: 'Templates/Frame',
  component: Component,
} as Meta;

const Template: StoryFn = () => {
  return (
    <Component>
      <div className='flex flex-col space-y-10'>
        <div className='flex flex-col space-y-6 border rounded p-8'>hoge</div>
        <div className='flex justify-center' />
      </div>
    </Component>
  );
};

export const Default = Template.bind({});
Default.args = {};
