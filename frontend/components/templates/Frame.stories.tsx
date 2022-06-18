import { Story, Meta } from '@storybook/react/types-6-0';
import Button from '../atoms/Button';
import Container from '../organisms/Hands';
import Players from '../organisms/Players';
import { Component } from './Frame';
export default {
  title: 'Templates/Frame',
  component: Component,
} as Meta;

const Template: Story = () => {
  return (
    <Component>
      <div className="flex flex-col space-y-10">
        <div className="flex flex-col space-y-6 border rounded p-8">hoge</div>
        <div className="flex justify-center"></div>
      </div>
    </Component>
  );
};

export const Default = Template.bind({});
Default.args = {};
