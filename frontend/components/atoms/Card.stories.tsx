import { Story, Meta } from '@storybook/react/types-6-0';
import Card from './Card';

export default {
  title: 'Atoms/Card',
  component: Card,
} as Meta;

const Template: Story = ({ value, shown, choosable, chosen }) => (
  <Card value={value} shown={shown} choosable={choosable} chosen={chosen} />
);

export const Shown = Template.bind({});
Shown.args = {
  value: '5',
  shown: true,
  choosable: true,
  chosen: false,
};

export const Hidden = Template.bind({});
Hidden.args = {
  value: '5',
  shown: false,
  choosable: true,
  chosen: false,
};
