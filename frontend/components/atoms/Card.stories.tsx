import { Story, Meta } from '@storybook/react/types-6-0';
import Card from './Card';

export default {
  title: 'Atoms/Card',
  component: Card,
} as Meta;

const Template: Story = ({ value, shown, choosable }) => (
  <Card value={value} shown={shown} choosable={choosable} />
);

export const Shown = Template.bind({});
Shown.args = {
  value: '5',
  shown: true,
  choosable: true,
};

export const Hidden = Template.bind({});
Hidden.args = {
  value: '5',
  shown: false,
  choosable: true,
};
