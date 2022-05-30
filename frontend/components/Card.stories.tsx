import { Story, Meta } from '@storybook/react/types-6-0';
import Card from './Card';

export default {
  title: 'Card',
  component: Card,
} as Meta;

const Template: Story = ({ value, isShown, isChoosable }) => (
  <Card value={value} isShown={isShown} isChoosable={isChoosable} />
);

export const Shown = Template.bind({});
Shown.args = {
  value: '5',
  isShown: true,
  isChoosable: true,
};

export const Hidden = Template.bind({});
Hidden.args = {
  value: '5',
  isShown: false,
  isChoosable: true,
};
