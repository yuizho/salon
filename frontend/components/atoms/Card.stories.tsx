import { Story, Meta } from '@storybook/react/types-6-0';
import Card from './Card';

export default {
  title: 'Atoms/Card',
  component: Card,
} as Meta;

const Template: Story = ({ value, shown, choosable, chosen, glow }) => (
  <Card value={value} shown={shown} choosable={choosable} chosen={chosen} glow={glow} />
);

export const Shown = Template.bind({});
Shown.args = {
  value: '5',
  shown: true,
  choosable: true,
  chosen: false,
  glow: false,
};

export const Hidden = Template.bind({});
Hidden.args = {
  value: '5',
  shown: false,
  choosable: true,
  chosen: false,
  glow: false,
};
