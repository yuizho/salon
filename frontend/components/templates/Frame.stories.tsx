import { Story, Meta } from '@storybook/react/types-6-0';
import Hands from '../organisms/Hands';
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
        <div className="border rounded p-8">
          <Players
            myUserId="xxx"
            players={[
              { userId: 'xxx', pickedCard: 'XL' },
              { userId: 'yyy', pickedCard: 'S' },
              { userId: 'zzz', pickedCard: 'M' },
              { userId: 'zzz', pickedCard: 'M' },
              { userId: 'zzz', pickedCard: 'M' },
              { userId: 'zzz', pickedCard: 'M' },
              { userId: 'zzz', pickedCard: 'M' },
              { userId: 'zzz', pickedCard: 'M' },
            ]}
            shown={false}
          />
        </div>
        <div className="flex justify-center">
          <Hands
            values={['0', '1', '2', '3', '5', '8', '13', '21', '34', '55']}
          />
        </div>
      </div>
    </Component>
  );
};

export const Default = Template.bind({});
Default.args = {};
