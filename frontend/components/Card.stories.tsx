import { Story, Meta } from '@storybook/react/types-6-0';
import Card from './Card';

export default {
  title: 'Card',
  component: Card,
} as Meta;

const Template: Story = () => <Card value="XS" />;

export const Default = Template.bind({});
